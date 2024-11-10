using BusinessObject.Models;
using DataAccess.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using Repositories.Implements;
using Repositories.Interface;
using Repositories.Service;
using System.Data;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using System.Net.Mail;
using System;


namespace Web_API_OPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAPI : ControllerBase
    {
        private UserRepository UserRepository = new UserRepository();
        private readonly Db6213Context _context;
        private readonly MailService _mailService;
        private static string storedOtp = "";
        private static DateTime otpExpiration;


        public UserAPI(Db6213Context context, MailService mailService)
        {
            _context = context;
            _mailService = mailService;

        }

        //Lấy danh sách user
        [HttpGet("getUser")]
        public ActionResult<IEnumerable<User>> getUser()
        {
            return UserRepository.GetUsers();
        }
        //Tạo 1 user mới
        [HttpPost("createUser")]
        public async Task<IActionResult> CreateUserAsync([FromBody] UserDTO u)
        {
            if (u == null || string.IsNullOrEmpty(u.Username))
            {
                return BadRequest("Invalid user data");
            }
            else if (await _context.Users.AnyAsync(us => us.Username == u.Username))
            {
                return BadRequest(new { message = "Username already exists" });
            }
            try
            {
                // Lấy giờ hiện tại theo giờ Việt Nam (GMT+7)
                TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
                DateTime utcNow = DateTime.UtcNow;
                DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

                // Mã hóa password
                string hashedPassword = HashPassword(u.Password);

                // Tạo đối tượng User mới với thông tin từ u và thời gian Việt Nam
                User user = new User()
                {
                    Username = u.Username,
                    Password = hashedPassword,
                    Email = u.Email,
                    Roles = u.Roles,
                    Status = u.Status,
                    PhoneNumber = u.PhoneNumber, // Thêm PhoneNumber từ UserDTO
                    ShopName = u.ShopName,
                    Address = u.Address,         // Thêm Address từ UserDTO
                    CreatedDate = currentVietnamTime
                };

                // Xử lý UserImage nếu có
                if (!string.IsNullOrEmpty(u.UserImage))
                {
                    if (Uri.IsWellFormedUriString(u.UserImage, UriKind.Absolute)) // Kiểm tra nếu là URL
                    {
                        user.UserImage = await GetImageBytesFromUrl(u.UserImage);
                    }
                    else // Nếu là chuỗi Base64
                    {
                        user.UserImage = Convert.FromBase64String(u.UserImage);
                    }
                }

                // Lưu đối tượng User vào cơ sở dữ liệu
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(getUserById), new { id = user.UserId }, user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
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
            string otp = GenerateOtp();
            // Lưu OTP vào biến tạm (hoặc có thể lưu trong DB)
            storedOtp = otp;

            string subject = "OTP for Password Reset";
            string body = $"Your OTP for password reset is: {otp}. This OTP is valid for 5 minutes.";
            bool emailSent = await _mailService.SendMailAsync(mail.RecipientEmail, subject, body);

            if (emailSent)
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "OTP sent successfully" });
            }

            return StatusCode(500, "Failed to send OTP");
        }

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
                return Ok(new { message = "OTP is valid and has not expired." });
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



        [HttpPost("changePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO changePasswordDto)
        {
            if (changePasswordDto.Id == 0)
            {
                return BadRequest(new { message = "Id is required" });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == changePasswordDto.Id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            string currentHashedPassword = HashPassword(changePasswordDto.CurrentPassword);
            if (user.Password != currentHashedPassword)
            {
                return BadRequest(new { message = "Current password is incorrect" });
            }

            string newHashedPassword = HashPassword(changePasswordDto.NewPassword);
            if (newHashedPassword == user.Password)
            {
                return BadRequest(new { message = "New password cannot be the same as the old password" });
            }

            user.Password = newHashedPassword;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password changed successfully" });
        }


        [HttpPost("changePassword_Email")]
        public async Task<IActionResult> ChangePassword_Email([FromBody] ChangePassword_EmailDTO changePassword_EmailDto)
        {

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == changePassword_EmailDto.Email);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            string newHashedPassword = HashPassword(changePassword_EmailDto.NewPassword);
            if (newHashedPassword == user.Password)
            {
                return BadRequest(new { message = "New password cannot be the same as the old password" });
            }

            user.Password = newHashedPassword;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password changed successfully" });
        }
        // Chỉnh sửa user đã tạo
        [HttpPost("updateUser")]
        public async Task<IActionResult> UpdateUserAsync([FromBody] UserDTO u)
        {
            if (u == null || string.IsNullOrEmpty(u.Username))
            {
                return BadRequest("Invalid User data");
            }

            try
            {
                string hashedPassword = HashPassword(u.Password);
                // Find the existing plant in the repository
                var existingUser = UserRepository.GetUserById(u.UserId);
                if (existingUser == null)
                {
                    return NotFound($"Plant with name {u.Username} not found.");
                }

                // Update the existing plant's properties
                existingUser.Username = u.Username;
                existingUser.Password = hashedPassword;
                existingUser.Email = u.Email;
                existingUser.PhoneNumber = u.PhoneNumber;
                existingUser.Roles = u.Roles;
                existingUser.FullName = u.FullName;
                existingUser.Address = u.Address;
                if (!string.IsNullOrEmpty(u.UserImage))
                {
                    if (Uri.IsWellFormedUriString(u.UserImage, UriKind.Absolute)) // Kiểm tra nếu là URL
                    {
                        existingUser.UserImage = await GetImageBytesFromUrl(u.UserImage);
                    }
                    else // Nếu là chuỗi Base64
                    {
                        existingUser.UserImage = Convert.FromBase64String(u.UserImage);
                    }
                }
                existingUser.Status = u.Status;
                existingUser.ShopName = u.ShopName;

                // Save changes
                UserRepository.UpdateUser(existingUser);

                return NoContent(); // 204 No Content on successful update
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        //Xóa 1 user 
        [HttpGet("deleteUser")]
        public IActionResult deleteUser(int UserId)
        {
            UserRepository.DeleteUser(UserId);
            return NoContent();
        }
        [HttpGet("getUserByIds")]
        public ActionResult<User> getUserByIds(int userId)
        {
            // Không lấy từ session nữa, mà từ tham số truyền vào
            var user = UserRepository.GetUserById(userId);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(new { message = "Successful", role = user.Roles, userId = user.UserId , userName = user.Username });
        }
        [HttpGet("getUserById")]
        public ActionResult<User> getUserById(int userId)
        {
            // Không lấy từ session nữa, mà từ tham số truyền vào
            var user = UserRepository.GetUserById(userId);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(user);
        }

        [HttpGet("getUserByRole")]
        public ActionResult<IEnumerable<User>> getUserByRole(int roleId)
        {
            // Không lấy từ session nữa, mà từ tham số truyền vào
            var users = UserRepository.GetUserByRole(roleId);

            if (users == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(users);

        }
       private string GenerateOtp()
        {
            Random random = new Random();
            return random.Next(100000, 999999).ToString();
        }
        [HttpPost("updateStatus")]
        public IActionResult UpdateStatus(int userId)
        {
            try
            {
                // Find the existing user by their ID
                var existingUser = UserRepository.GetUserById(userId);
                if (existingUser == null)
                {
                    return NotFound($"User with ID {userId} not found.");
                }

                // Toggle the user's status
                existingUser.Status = existingUser.Status == 0 ? 1 : 0;

                // Save changes to the repository
                UserRepository.UpdateUser(existingUser);

                // Return success message with the new status
                return Ok($"User '{existingUser.Username}' status has been set to {(existingUser.Status == 1 ? "verified" : "unverified")}.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        private string GenerateOtp()
        {
            Random random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        //hàm mã hóa password khi create user
        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }
        private async Task<byte[]> GetImageBytesFromUrl(string imageUrl)
        {
            using (HttpClient client = new HttpClient())
            {
                return await client.GetByteArrayAsync(imageUrl);
            }
        }
    }
    
}
