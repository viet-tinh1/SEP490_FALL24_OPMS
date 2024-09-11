using BusinessObject.Models;
using DataAccess.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories.Implements;
using Repositories.Interface;
using System.Data;
using System.Net;

namespace Web_API_OPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAPI : ControllerBase
    {
        private UserRepository UserRepository = new UserRepository();
        //Lấy danh sách user
        [HttpGet("getUser")]
        public ActionResult<IEnumerable<User>> getUser()
        {
            return UserRepository.GetUsers();
        }
        //Tạo 1 user mới
        [HttpPost("createUser")]
        public IActionResult CreateUser([FromBody] UserDTO u)
        {
            if (u == null || string.IsNullOrEmpty(u.Username))
            {
                return BadRequest("Invalid plant data");
            }

            try
            {
                User user = new User()
                {
                    Username = u.Username,
                    Password = u.Password,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    Roles = u.Roles,
                    FullName = u.FullName,
                    Address = u.Address,
                    UserImage = u.UserImage,
                    Status = u.Status
                };
                UserRepository.CreateUser(user);
                return CreatedAtAction(nameof(CreateUser), new { id = user.UserId }, user);
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
                // Find the existing plant in the repository
                var existingUser = UserRepository.GetUserById(u.UserId);
                if (existingUser == null)
                {
                    return NotFound($"Plant with name {u.Username} not found.");
                }

                // Update the existing plant's properties
                existingUser.Username = u.Username;
                existingUser.Password = u.Password;
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
        public ActionResult<User> getUserById(int id)
        {
            return UserRepository.GetUserById(id);
        }
    }
}
