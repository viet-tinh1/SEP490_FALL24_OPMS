using BusinessObject.Models;
using DataAccess.DTO;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace Web_API_OPMS.Controllers.Authentication
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly Db6213Context _context;
        private readonly IConfiguration _configuration;

        public AuthController(Db6213Context context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // API Đăng ký
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            // Lấy giờ hiện tại theo giờ Việt Nam (GMT+7)
            TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            DateTime utcNow = DateTime.UtcNow;
            DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

            if (await _context.Users.AnyAsync(u => u.Username == user.Username || u.Email == user.Email))
            {
                return BadRequest(new { message = "Username or Email already exists" });
            }

            // Hash mật khẩu
            user.Password = HashPassword(user.Password);
            user.CreatedDate = currentVietnamTime;
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "User registered successfully" });
        }

        // API Đăng nhập
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Tìm người dùng theo tên đăng nhập
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            // Kiểm tra nếu không tìm thấy người dùng hoặc mật khẩu không hợp lệ
            if (user == null || !VerifyPassword(request.Password, user.Password))
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }
            else if (user == null || user.Status == 0 )
            {
                return Unauthorized(new { message = "Your account has been locked " });
            }
            var token = GenerateJwtToken(user);
            HttpContext.Session.SetInt32("UserId", user.UserId);
            HttpContext.Session.SetInt32("UserRole", user.Roles);
            return Ok(new { message = "Login successful", role = user.Roles, token = token, userId=user.UserId ,email=user.Email,username=user.Username});
        }
        // login with google
        [HttpGet("google-login")]
        public IActionResult GoogleLogin()
        {
            var properties = new AuthenticationProperties
            {
                RedirectUri = Url.Action("GoogleResponse") // Where to redirect after Google login
            };
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);  // This initiates the Google login process
        }

        [HttpGet("google-response")]
        public async Task<IActionResult> GoogleResponse()
        {
            var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            if (!authenticateResult.Succeeded)
            {
                return BadRequest("Google authentication failed.");
            }

            // Retrieve user info from the claims
            var email = authenticateResult.Principal.FindFirstValue(ClaimTypes.Email);
            var name = authenticateResult.Principal.FindFirstValue(ClaimTypes.Name);

            // Check if user already exists in your database
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                // If user doesn't exist, create a new one
                user = new User
                {
                    Username = name,
                    Email = email,
                    CreatedDate = DateTime.UtcNow,
                    Roles = 2,
                    Status = 1,
                    IsVerifyEmail = 1, 
                    Password = HashPassword(GenerateRandomPassword(12)) // Generate random password with length 12
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            // Sign in the user by issuing a cookie
            var token = GenerateJwtToken(user);
            HttpContext.Session.SetInt32("UserId", user.UserId);
            HttpContext.Session.SetInt32("UserRole", user.Roles);

            return Redirect($"http://localhost:5173/product?userId={user.UserId}&role={user.Roles}&token={token}&username={user.Username}&email={user.Email}");
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear(); // Xóa tất cả các session hiện tại
            return Ok(new { message = "Logout successful" });
        }

        // Hàm hash mật khẩu
        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }


        // Hàm kiểm tra mật khẩu
        private bool VerifyPassword(string enteredPassword, string storedPassword)
        {
            return HashPassword(enteredPassword) == storedPassword;
        }
        private string GenerateJwtToken(User user)
        {
            // JWT token generation logic
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JwtConfig:Secret"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
            new Claim(ClaimTypes.Name, user.UserId.ToString()),
            new Claim(ClaimTypes.Role, user.Roles.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string GenerateRandomPassword(int length)
        {
            const string validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()";
            StringBuilder password = new StringBuilder();
            Random random = new Random();

            for (int i = 0; i < length; i++)
            {
                password.Append(validChars[random.Next(validChars.Length)]);
            }

            return password.ToString();
        }

    }
    
    // Lớp LoginRequest để đăng nhập 
    public class LoginRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}

