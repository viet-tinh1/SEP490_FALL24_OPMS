using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Service
{
    public class MailService
    {
        private readonly IConfiguration _configuration;

        public MailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<bool> SendMailAsync(string recipientEmail, string subject, string body)
        {
            try
            {
                // Lấy thông tin email và mật khẩu từ file cấu hình
                string senderEmail = _configuration["EmailSettings:SenderEmail"];
                string senderPassword = _configuration["EmailSettings:SenderPassword"];
                string displayName = "Plant Store"; // Thay đổi tên hiển thị của bạn tại đây

                // Tạo đối tượng MailMessage với tên hiển thị
                MailMessage message = new MailMessage();
                message.From = new MailAddress(senderEmail, displayName); // Thêm tên hiển thị ở đây
                message.To.Add(new MailAddress(recipientEmail));
                message.Subject = subject;
                message.Body = body;

                message.BodyEncoding = System.Text.Encoding.UTF8;
                message.SubjectEncoding = System.Text.Encoding.UTF8;
                message.IsBodyHtml = true;
                message.ReplyToList.Add(new MailAddress(senderEmail));
                message.Sender = new MailAddress(senderEmail, displayName); // Đảm bảo tên hiển thị cho người gửi cũng được cấu hình ở đây

                // Cấu hình SMTP Client
                using (SmtpClient client = new SmtpClient("smtp.gmail.com"))
                {
                    client.Port = 587;
                    client.Credentials = new NetworkCredential(senderEmail, senderPassword);
                    client.EnableSsl = true;

                    // Gửi email
                    await client.SendMailAsync(message);
                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email: {ex.Message}");
                return false;
            }
        }
    }
}
