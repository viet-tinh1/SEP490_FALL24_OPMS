﻿using BusinessObject.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Cryptography;
using System.Text;

namespace Web_API_OPMS.Controllers.Authentication
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly Db6213Context _context;

        public AuthController(Db6213Context context)
        {
            _context = context;
        }

        // API Đăng ký
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if (await _context.Users.AnyAsync(u => u.Username == user.Username || u.Email == user.Email))
            {
                return BadRequest(new { message = "Username or Email already exists" });
            }

            // Hash mật khẩu
            user.Password = HashPassword(user.Password);
            user.CreatedDate = DateTime.UtcNow;
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
            HttpContext.Session.SetInt32("UserId", user.UserId);
            HttpContext.Session.SetInt32("UserRole", user.Roles);
            return Ok(new { message = "Login successful", role = user.Roles });
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
    }

    // Lớp LoginRequest để đăng nhập 
    public class LoginRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
