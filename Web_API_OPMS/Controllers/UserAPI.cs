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
using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Microsoft.IdentityModel.Tokens;


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
        private readonly IConfiguration _configuration;


        public UserAPI(Db6213Context context, MailService mailService, IConfiguration configuration)
        {
            _context = context;
            _mailService = mailService;
            _configuration = configuration;
        }

        //Lấy danh sách user
        [HttpGet("getUser")]
        public ActionResult<IEnumerable<User>> getUser()
        {
            return UserRepository.GetUsers();
        }
        //Tạo 1 user mới
        [HttpPost("createUser")]
        public async Task<IActionResult> CreateUserAsync([FromForm] UserDTO u, IFormFile uploadedImage = null)
        {
            if (u == null || string.IsNullOrEmpty(u.Username) )
            {
                return BadRequest("Invalid user data");
            }
            else if (await _context.Users.AnyAsync(us => us.Username == u.Username))
            {
                return BadRequest(new { message = "Username already exists" });
            }

            try
            {
                // Get current time in Vietnam timezone
                TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
                DateTime utcNow = DateTime.UtcNow;
                DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

                // Hash the password
                string hashedPassword = HashPassword(u.Password);

                // Create the User object
                User user = new User()
                {
                    Username = u.Username,
                    Password = hashedPassword,
                    Email = u.Email,
                    Roles = u.Roles,
                    Status = u.Status,
                    PhoneNumber = u.PhoneNumber, // Thêm PhoneNumber từ UserDTO
                    ShopName = u.ShopName,
                    Address = u.Address,
                    CreatedDate = currentVietnamTime
                };

                // Handle image upload or URL
                if (uploadedImage != null)

                {
                    string imageUrl = await UploadImageToImgbb(uploadedImage);
                    if (string.IsNullOrEmpty(imageUrl))
                    {
                        return BadRequest("Image upload failed.");
                    }
                    user.UserImage = imageUrl;
                }

                UserRepository.CreateUser(user);

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

            string subject = "Mã OTP Đặt Lại Mật Khẩu";
            string body = $"Mã OTP để đặt lại mật khẩu của bạn là: {otp}. Mã OTP này có hiệu lực trong vòng 3 phút.";
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
        public async Task<IActionResult> UpdateUserAsync([FromForm] UserDTO u, IFormFile uploadedImage = null)
        {
            if (u == null || string.IsNullOrEmpty(u.Username))
            {
                return BadRequest("Invalid user data");
            }

            try
            {
                // Find the existing user
                var existingUser = UserRepository.GetUserById(u.UserId);
                if (existingUser == null)
                {
                    return NotFound($"User with username {u.Username} not found.");
                }
                var isUsernameDuplicate = await _context.Users.AnyAsync(us =>
                   us.UserId != u.UserId && // Đảm bảo không phải người dùng hiện tại
                   us.Username == u.Username
                );
                if (isUsernameDuplicate)
                {
                    return BadRequest(new { message = "Username already exists" });
                }
                // Kiểm tra trùng Email
                var isEmailDuplicate = await _context.Users.AnyAsync(us =>
                    us.UserId != u.UserId && // Đảm bảo không phải người dùng hiện tại
                    us.Email == u.Email
                );
                if (isEmailDuplicate)
                {
                    return BadRequest(new { message = "Email already exists" });
                }

                // Kiểm tra trùng PhoneNumber
                var isPhoneDuplicate = await _context.Users.AnyAsync(us =>
                    us.UserId != u.UserId && // Đảm bảo không phải người dùng hiện tại
                    us.PhoneNumber == u.PhoneNumber
                );
                if (isPhoneDuplicate)
                {
                    return BadRequest(new { message = "Phone number already exists" });
                }
                // Update user properties
                existingUser.Username = u.Username;
                existingUser.Email = u.Email;
                existingUser.PhoneNumber = u.PhoneNumber;
                existingUser.Roles = u.Roles;
                existingUser.FullName = u.FullName;
                existingUser.Address = u.Address;
                if (!string.IsNullOrEmpty(u.Password) && u.Password != existingUser.Password)
                {
                    existingUser.Password = HashPassword(u.Password);
                }

                // Handle image update
                if (uploadedImage != null && uploadedImage.Length > 0)
                {
                    // Upload the new image to imgbb
                    string imageUrl = await UploadImageToImgbb(uploadedImage);
                    if (string.IsNullOrEmpty(imageUrl))
                    {
                        return BadRequest("Image upload failed.");
                    }

                    // Optionally: Delete the existing image from imgbb if it has been replaced
                    if (!string.IsNullOrEmpty(existingUser.UserImage))
                    {
                        await DeleteImageFromImgbb(existingUser.UserImage);
                    }

                    // Update the UserImage property with the new URL
                    existingUser.UserImage = imageUrl;
                }

                // Update other fields
                existingUser.Status = u.Status;
                existingUser.ShopName = u.ShopName;

                UserRepository.UpdateUser(existingUser);

                return Ok(new { message = "User updated successfully", updatedUser = existingUser });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpPost("updateUserImage")]
        public async Task<IActionResult> UpdateUserImage(int userId, IFormFile newImage)
        {
            if (newImage == null || newImage.Length == 0)
            {
                return BadRequest("No image file provided.");
            }

            try
            {
                // Find the existing user by their ID
                var existingUser = UserRepository.GetUserById(userId);
                if (existingUser == null)
                {
                    return NotFound($"User with ID {userId} not found.");
                }

                // Upload the new image to imgbb
                string newImageUrl = await UploadImageToImgbb(newImage);
                if (string.IsNullOrEmpty(newImageUrl))
                {
                    return BadRequest("Image upload failed.");
                }

                // Optionally: Delete the existing image from imgbb if it has been replaced
                if (!string.IsNullOrEmpty(existingUser.UserImage))
                {
                    await DeleteImageFromImgbb(existingUser.UserImage);
                }

                // Update the UserImage property with the new URL
                existingUser.UserImage = newImageUrl;

                // Save changes to the repository
                UserRepository.UpdateUser(existingUser);

                return Ok(new { message = "User image updated successfully", imageUrl = newImageUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        //Xóa 1 user 
        [HttpGet("deleteUser")]
        public async Task<IActionResult> deleteUser(int UserId)
        {
            try
            {
                var user = UserRepository.GetUserById(UserId);
                if (user == null)
                {
                    return NotFound($"User with ID {UserId} not found.");
                }

                // Delete user image from imgbb if exists
                if (!string.IsNullOrEmpty(user.UserImage))
                {
                    await DeleteImageFromImgbb(user.UserImage);
                }

                UserRepository.DeleteUser(UserId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
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

            return Ok(new { message = "Successful", role = user.Roles, userId = user.UserId , userName = user.Username, Image = user.UserImage });
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
        [HttpPost("updateShopName")]
        public async Task<IActionResult> UpdateShopName(UserDTO u)
        {
            try
            {
                // Find the existing user by their ID
                var existingUser = UserRepository.GetUserById(u.UserId);
                if (existingUser == null)
                {
                    return NotFound($"User with ID {u.UserId} not found.");
                }
                // Check if the new username or email already exists in the database
                var isDuplicate = await _context.Users.AnyAsync(us =>
                    us.UserId != u.UserId && // Ensure it's not the current user
                    (us.ShopName == u.ShopName)
                );

                if (isDuplicate)
                {
                    return BadRequest(new { message = "ShopName already exists" });
                }
                // Kiểm tra xem Email có bị trùng không
                var isEmailDuplicate = await _context.Users.AnyAsync(us =>
                    us.UserId != u.UserId && // Đảm bảo không phải người dùng hiện tại
                    us.Email == u.Email
                );

                if (isEmailDuplicate)
                {
                    return BadRequest(new { message = "Email already exists" });
                }

                // Toggle the user's status
                existingUser.ShopName = u.ShopName;
                existingUser.Address = u.Address;
                existingUser.Email = u.Email;

                // Save changes to the repository
                UserRepository.UpdateUser(existingUser);

                // Return success message with the new status
                return Ok(new { message = "Shop name updated successfully" });
            
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpPost("Request-seller")]
        public IActionResult Requestseller(int  userId)
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
                existingUser.IsSellerRequest = 1;
               

                // Save changes to the repository
                UserRepository.UpdateUser(existingUser);

                // Return success message with the new status
                return Ok(new { message = "Shop name updated successfully" });

            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpGet("getUserRequest")]
        public ActionResult<IEnumerable<User>> getUserRequest(int request)
        {
            // Không lấy từ session nữa, mà từ tham số truyền vào
            var users = UserRepository.GetUserRequest(request);

            if (users == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(users);
        }

        [HttpPost("updateRoleSeller")]
        public IActionResult UpdateRoleSeller([FromQuery] int userId, [FromQuery] int? req)
        {
            try
            {
                // Fetch user by ID
                var existingUser = UserRepository.GetUserById(userId);
                if (existingUser == null)
                {
                    return NotFound($"User with ID {userId} not found.");
                }

                // Update roles and seller request status based on the request
                if (req == 1) // Approve request
                {
                    existingUser.Roles = 3; // Set role to 'Seller'
                    existingUser.IsSellerRequest = 2; // Mark request as 'Accepted'
                }
                else // Reject request
                {
                    existingUser.Roles = 2; // Set role back to 'User'
                    existingUser.IsSellerRequest = 3; // Mark request as 'Rejected'
                }

                // Save changes
                UserRepository.UpdateUser(existingUser);

                // Return success message
                string action = req == 1 ? "approved as a Seller" : "rejected as a Seller";
                return Ok($"User '{existingUser.Username}' has been {action}.");
            }
            catch (Exception ex)
            {
                // Log the error (if applicable) and return a generic error message
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
        private async Task<string> UploadImageToImgbb(IFormFile image)
        {
            try
            {
                using (var httpClient = new HttpClient())
                {
                    // Convert IFormFile to byte array
                    byte[] imageBytes;
                    using (var memoryStream = new MemoryStream())
                    {
                        await image.CopyToAsync(memoryStream);
                        imageBytes = memoryStream.ToArray();
                    }

                    // Prepare the content for the request
                    var formData = new MultipartFormDataContent();
                    formData.Add(new ByteArrayContent(imageBytes), "image", image.FileName);

                    // Get imgbb API key from appsettings
                    string imgbbApiKey = _configuration["Imgbb:ApiKey"];
                    string imgbbApiUrl = $"https://api.imgbb.com/1/upload?key={imgbbApiKey}";

                    // Send the request to imgbb
                    HttpResponseMessage response = await httpClient.PostAsync(imgbbApiUrl, formData);
                    if (response.IsSuccessStatusCode)
                    {
                        var responseContent = await response.Content.ReadAsStringAsync();
                        dynamic jsonResponse = Newtonsoft.Json.JsonConvert.DeserializeObject(responseContent);
                        return jsonResponse?.data?.url;
                    }
                    else
                    {
                        return null;
                    }
                }
            }
            catch
            {
                return null;
            }
        }

        private async Task DeleteImageFromImgbb(string imageUrl)
        {
            try
            {
                using (var httpClient = new HttpClient())
                {
                    // Extract the image delete hash from the imageUrl if available
                    string deleteHash = GetImgbbDeleteHash(imageUrl);
                    if (string.IsNullOrEmpty(deleteHash)) return;

                    // Get imgbb API key from appsettings
                    string imgbbApiKey = _configuration["Imgbb:ApiKey"];
                    string imgbbDeleteUrl = $"https://api.imgbb.com/1/image/{deleteHash}?key={imgbbApiKey}";

                    // Send DELETE request to imgbb
                    await httpClient.DeleteAsync(imgbbDeleteUrl);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to delete image from imgbb: {ex.Message}");
            }
        }

        private string GetImgbbDeleteHash(string imageUrl)
        {
            try
            {
                var uri = new Uri(imageUrl);
                var query = uri.Query;
                var queryDictionary = System.Web.HttpUtility.ParseQueryString(query);
                return queryDictionary["delete"];
            }
            catch
            {
                return null;
            }
        }
    }
    
}
