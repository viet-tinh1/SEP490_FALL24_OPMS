using BusinessObject.Models;
using DataAccess.DAO;
using DataAccess.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Repositories.Implements;
using Repositories.Interface;

namespace Web_API_OPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostAPI : ControllerBase
    {
        private readonly IPostRepository _postRepository;
        public PostAPI(IPostRepository postRepository)
        {
            _postRepository = postRepository;
        }
        //lấy danh sach post
        [HttpGet("getPost")]
        public ActionResult<IEnumerable<Post>> GetsPost()
        {
            var post = _postRepository.GetPosts();
            if(post == null)
            {
                return NotFound(new { message = "Không có bài viêt nào được tìm thấy." });
            }
            return Ok(post);
        }
        [HttpGet("getPostById")]
        public ActionResult<Post> GetPostById(int postId) 
        {
            var post = _postRepository.GetPostById(postId);
            if(post == null)
            {
                return NotFound(new {message="Không tồn tại bài viết."});
            }
            return Ok(post);
        }
        [HttpGet("getPostByUserId")]
        public ActionResult<IEnumerable<Review>> GetPostByUserId(int userId)
        {
            var post = _postRepository.GetPostByUserId(userId);

            if (post == null || !post.Any())
            {
                return NotFound(new { message = "No post found for the specified user." });
            }

            return Ok(post);
        }
        [HttpPost("createPost")]
        public async Task<IActionResult> CreateReviewAsync([FromBody] PostDTO postDTO)
        {
            if (postDTO == null)
            {
                return BadRequest("Invalid post data");
            }

            try
            {
                // Lấy giờ hiện tại theo giờ Việt Nam (GMT+7)
                TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
                DateTime utcNow = DateTime.UtcNow;
                DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

                Post post = new Post()
                {
                    PostId = postDTO.PostId,
                    UserId = postDTO.UserId,          
                    PostContent = postDTO.PostContent,
                    LikePost =  0,
                    Createdate = currentVietnamTime,
                    UpdatedAt = currentVietnamTime,
                };
                if (!string.IsNullOrEmpty(postDTO.PostImage))
                {
                    if (Uri.IsWellFormedUriString(postDTO.PostImage, UriKind.Absolute)) // Kiểm tra nếu là URL
                    {
                        post.PostImage = await GetImageBytesFromUrl(postDTO.PostImage);
                    }
                    else // Nếu là chuỗi Base64
                    {
                        post.PostImage = Convert.FromBase64String(postDTO.PostImage);
                    }
                }

                _postRepository.CreatePost(post);

                return CreatedAtAction(nameof(GetPostById), new { id = post.PostId }, post);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpPost("updatePost")]
        public async Task<IActionResult> UpdateReviewAsync([FromBody] PostDTOU postDTOU)
        {
            if (postDTOU == null)
            {
                return BadRequest("Invalid review data");
            }

            try
            {
                // Lấy giờ hiện tại theo giờ Việt Nam (GMT+7)
                TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
                DateTime utcNow = DateTime.UtcNow;
                DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);
                var existingPost = _postRepository.GetPostById(postDTOU.PostId);
                if (existingPost == null)
                {
                    return NotFound($"Review with ID {postDTOU.PostId} not found.");
                }

                // Cập nhật các thuộc tính của review
                existingPost.UserId = postDTOU.UserId;
                existingPost.PostId = postDTOU.PostId;
                existingPost.PostContent = postDTOU.PostContent;
                existingPost.UpdatedAt = postDTOU.UpdatedAt ?? currentVietnamTime;
                if (!string.IsNullOrEmpty(postDTOU.PostImage))
                {
                    if (Uri.IsWellFormedUriString(postDTOU.PostImage, UriKind.Absolute)) // Kiểm tra nếu là URL
                    {
                        existingPost.PostImage = await GetImageBytesFromUrl(postDTOU.PostImage);
                    }
                    else // Nếu là chuỗi Base64
                    {
                        existingPost.PostImage = Convert.FromBase64String(postDTOU.PostImage);
                    }
                }

                _postRepository.UpdatePost(existingPost);

                return Ok(new { message = "Review updated successfully", updatedPost = existingPost });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        // Xóa Review
        [HttpDelete("deletePost")]
        public IActionResult DeletePost(int id)
        {
            try
            {
                var post = _postRepository.GetPostById(id);
                if (post == null)
                {
                    return NotFound($"Review with ID {id} not found.");
                }

                _postRepository.DeletePost(id);

                return Ok(new { message = "Post deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPost("likePost")]
        public IActionResult LikePost(int id)
        {
            try
            {
                var post = _postRepository.GetPostById(id);
                if (post == null)
                {
                    return NotFound($"Review with ID {id} not found.");
                }
                post.LikePost += 1;
                _postRepository.UpdatePost(post);

                return Ok(new { message = "Like post successfully", post });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
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
