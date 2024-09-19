﻿using BusinessObject.Models;
using DataAccess.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Repositories.Implements;
using Repositories.Interface;
using System.Data;
using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace Web_API_OPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAPI : ControllerBase
    {
        private UserRepository UserRepository = new UserRepository();
        private readonly Db6213Context _context;

        public UserAPI(Db6213Context context)
        {
            _context = context;
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
                return BadRequest("Invalid plant data");
            }
            else if (await _context.Users.AnyAsync(us => us.Username == u.Username))
            {
                return BadRequest(new { message = "Username already exists" });
            }
            try
            {
                // mã hóa password
                string hashedPassword = HashPassword(u.Password);
                User user = new User()
                {
                    Username = u.Username,
                    Password = hashedPassword,
                    Email = u.Email,
                   
                    Roles = u.Roles,
                   
                    Status = u.Status
                };
                UserRepository.CreateUser(user);
                return CreatedAtAction(nameof(getUserById), new { id = user.UserId }, user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        // Chỉnh sửa user đã tạo
        [HttpPost("updateUser")]
        public IActionResult UpdateUser([FromBody] UserDTO u)
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
                existingUser.UserImage = u.UserImage;
                existingUser.Status = u.Status;

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
        [HttpGet("getUserById")]
        
        public ActionResult<User> getUserById()
        {
            // Lấy ID người dùng từ session
            var userId = HttpContext.Session.GetInt32("UserId");

            if (userId == null)
            {
                return Unauthorized(new { message = "User not logged in" });
            }

            var user = UserRepository.GetUserById(userId.Value);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            return Ok(user);
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
    }
}