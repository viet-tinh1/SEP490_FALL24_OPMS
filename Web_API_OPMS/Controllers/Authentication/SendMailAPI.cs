using BusinessObject.Models;
using DataAccess.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Repositories.Implements;
using Repositories.Service;

namespace Web_API_OPMS.Controllers.Authentication
{
    [Route("api/[controller]")]
    [ApiController]
    public class SendMailAPI : ControllerBase
    {
        private readonly MailService _mailService;
        private readonly IConfiguration _configuration;
        private readonly Db6213Context _context;
        // Giả sử bạn có một nơi lưu trữ mã OTP và thời gian hết hạn cho người dùng (có thể là DB hoặc bộ nhớ tạm)
        private static string storedOtp = "";
        private static DateTime otpExpiration;

        public SendMailAPI(MailService mailService, IConfiguration configuration, Db6213Context context)
        {
            _mailService = mailService;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("send-email")]
        public async Task<IActionResult> SendEmail([FromBody] MailRequestDto mailRequest)
        {
            // Generate random passcode
            string passcode = GenerateRandomPasscode();
            TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            DateTime utcNow = DateTime.UtcNow;
            DateTime vietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);
            otpExpiration = vietnamTime.AddMinutes(3); // OTP hết hạn sau 3 phút

            string subject = "Xác thực tài khoản";
            string body = $"<p>Kính gửi: {mailRequest.Username},</p>" +
                $"<p>Chúng tôi xin thông báo rằng tài khoản của bạn trên trang web OPMS đã được tạo thành công.</p>" +
                $"<p>Dưới đây là thông tin chi tiết về tài khoản của bạn:</p>" +
                $"<ul>" +
                $"<li><strong>Tên tài khoản:</strong> {mailRequest.Username}</li>" +
                $"<li><strong>Email:</strong> {mailRequest.RecipientEmail}</li>" +
                $"</ul>" +
                $"<p>Để bắt đầu sử dụng tài khoản và truy cập vào các sản phẩm bonsai của chúng tôi, vui lòng nhập mã sau để xác thực tài khoản:</p>" +
                $"<p><strong>Mã xác thực: {passcode}</strong></p>" +
                $"<p>Mã xác thực có hiệu lực đến: {otpExpiration.ToString("HH:mm:ss")} UTC</p>" +
                $"<p>Cảm ơn bạn đã đăng ký tại OPMS! Nếu bạn cần hỗ trợ, xin vui lòng liên hệ với chúng tôi qua các thông tin bên dưới.</p>" +
                $"<p>Trân trọng,<br>Đội ngũ OPMS</p>" +
                $"<p>Website: <a href='https://www.opms.com'>https://www.opms.com</a></p>" +
                $"<p>Facebook: <a href='https://www.facebook.com/opmsbonsai'>https://www.facebook.com/opmsbonsai</a></p>" +
                $"<p><em>Lưu ý: Đây là email tự động, vui lòng không trả lời email này.</em></p>";

            // Lưu OTP vào biến tạm (hoặc có thể lưu trong DB)
            storedOtp = passcode;

            // Fetch sender credentials from appsettings.json
            string senderEmail = _configuration["EmailSettings:SenderEmail"];
            string senderPassword = _configuration["EmailSettings:SenderPassword"];

            bool result = await _mailService.SendMailAsync(
                
                mailRequest.RecipientEmail,
                subject,
                body);

            if (result)
            {
                return Ok(new { message = "Email sent successfully", otp = passcode, otpExpiration = otpExpiration });
            }
            else
            {
                return StatusCode(500, "Failed to send email");
            }
        }
        // API xác thực OTP
        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] VerifyOtpRequestDto verifyRequest)
        {
            // Lấy giờ hiện tại theo giờ Việt Nam (GMT+7)
            TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            DateTime utcNow = DateTime.UtcNow;
            DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);
            // Kiểm tra mã OTP có đúng và không hết hạn
            if (verifyRequest.Otp == storedOtp && currentVietnamTime <= otpExpiration)
            {
                var user = _context.Users.FirstOrDefault(u => u.Email == verifyRequest.RecipientEmail);

                if (user != null)
                {
                    // Cập nhật trạng thái verify thành 1
                    user.IsVerifyEmail = 1;

                    // Lưu thay đổi vào cơ sở dữ liệu
                     _context.Update(user);
                     _context.SaveChangesAsync();

                    return Ok(new { message = "OTP is valid and has not expired." });
                }
                else
                {
                    return NotFound(new { message = "User not found with the provided email." });
                }
            }
            else if (currentVietnamTime > otpExpiration)
            {
                return BadRequest(new { message = "OTP has expired." });
            }
            else
            {
                return BadRequest(new { message = "Invalid OTP." });
            }
        }
        [HttpPost("sendOtpToEmail")]
        public async Task<IActionResult> SendOtpToEmail([FromBody] MailDto mail)
        {
            TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            DateTime utcNow = DateTime.UtcNow;
            DateTime vietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);
            otpExpiration = vietnamTime.AddMinutes(3); // OTP hết hạn sau 3 phút
            if (string.IsNullOrEmpty(mail.RecipientEmail))
            {
                return BadRequest(new { message = "Email is required" });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == mail.RecipientEmail);
            if (user == null)
            {
                return NotFound(new { message = "Email not registered" });
            }

            // Tạo OTP và gửi qua email
            string otp = GenerateRandomPasscode();
            // Lưu OTP vào biến tạm (hoặc có thể lưu trong DB)
            storedOtp = otp;

            string subject = "Mã OTP Xác Thực Email";
            string body = $"Mã OTP để xác thực email của bạn là: {otp}. Mã OTP này có hiệu lực trong vòng 3 phút.";
            bool emailSent = await _mailService.SendMailAsync(mail.RecipientEmail, subject, body);

            if (emailSent)
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "OTP sent successfully" });
            }

            return StatusCode(500, "Failed to send OTP");
        }

        [HttpPost("verify-otp-seller")]
        public IActionResult VerifyOtpSeller([FromBody] VerifyOtpRequestDto verifyRequest)
        {
            // Lấy giờ hiện tại theo giờ Việt Nam (GMT+7)
            TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            DateTime utcNow = DateTime.UtcNow;
            DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);
            // Kiểm tra mã OTP có đúng và không hết hạn
            if (verifyRequest.Otp == storedOtp && currentVietnamTime <= otpExpiration)
            {
                var user = _context.Users.FirstOrDefault(u => u.Email == verifyRequest.RecipientEmail);

                if (user != null)
                {
                    // Cập nhật trạng thái verify thành 1
                    user.IsVerifyEmail = 1;

                    // Lưu thay đổi vào cơ sở dữ liệu
                    _context.Update(user);
                    _context.SaveChangesAsync();

                    return Ok(new { message = "OTP is valid and has not expired." });
                }
                else
                {
                    return NotFound(new { message = "User not found with the provided email." });
                }
            }
            else if (currentVietnamTime > otpExpiration)
            {
                return BadRequest(new { message = "OTP has expired." });
            }
            else
            {
                return BadRequest(new { message = "Invalid OTP." });
            }
        }
        private string GenerateRandomPasscode()
        {
            // Implement your passcode generation logic here
            return new Random().Next(100000, 999999).ToString();
        }
    }
}

