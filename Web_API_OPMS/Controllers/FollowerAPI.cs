using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories.Interface;

namespace Web_API_OPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FollowerAPI : ControllerBase
    {
        private readonly IFollowerRepository _followerRepository;
        public FollowerAPI(IFollowerRepository followerRepository)
        {
            _followerRepository = followerRepository;
        }
        [HttpPost("addFollower")]
        public async Task<IActionResult> ToggleAndCheckFollower(int userId, int followerId)
        {
            try
            {
                // Thực hiện toggle trạng thái follower
                var message = await _followerRepository.ToggleFollowerAsync(userId, followerId);

                // Kiểm tra trạng thái follower sau khi toggle
                bool isFollowing = await _followerRepository.IsFollowingAsync(userId, followerId);

                // Trả về kết quả bao gồm trạng thái và thông điệp
                return Ok(new
                {
                    userId,
                    followerId,
                    isFollowing,
                    message
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi.", chiTiet = ex.Message });
            }
        }
        [HttpGet("countFollower")]
        public async Task<IActionResult> CountFollowers(int followerId)
        {
            try
            {
                int count = await _followerRepository.CountFollowersAsync(followerId);
                return Ok(new { followerId, count, message = "Thành công" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi.", chiTiet = ex.Message });
            }
        }
        [HttpGet("is-following")]
        public async Task<IActionResult> IsFollowing(int userId, int followerId)
        {
            try
            {
                bool isFollowing = await _followerRepository.IsFollowingAsync(userId, followerId);
                return Ok(new { userId, followerId, isFollowing, message = "Thành công" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi.", chiTiet = ex.Message });
            }
        }
    }
}
