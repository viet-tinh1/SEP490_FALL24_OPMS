using BusinessObject.Models;
using DataAccess.DAO;
using DataAccess.DTO;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
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
        private readonly IConfiguration _configuration;
        public PostAPI(IPostRepository postRepository, IConfiguration configuration)
        {
            _postRepository = postRepository;
            _configuration = configuration;
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
        public ActionResult<IEnumerable<Post>> GetPostByUserId(int userId)
        {
            var post = _postRepository.GetPostByUserId(userId);

            if (post == null || !post.Any())
            {
                return NotFound(new { message = "No post found for the specified user." });
            }

            return Ok(post);
        }
        [HttpPost("createPost")]
        public async Task<IActionResult> CreatePostAsync([FromForm] PostDTO postDTO, IFormFile uploadedImage)
        {
            if (postDTO == null || uploadedImage == null || uploadedImage.Length == 0)
            {
                return BadRequest("Invalid post data or image.");
            }

            try
            {
                // Get the current time in Vietnam timezone
                TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
                DateTime utcNow = DateTime.UtcNow;
                DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

                // Create the Post object
                Post post = new Post()
                {
                    PostId = postDTO.PostId,
                    UserId = postDTO.UserId,
                    PostContent = postDTO.PostContent,
                    LikePost = 0,
                    Createdate = currentVietnamTime,
                    UpdatedAt = currentVietnamTime,
                };

                // Upload the image to imgbb
                string imageUrl = await UploadImageToImgbb(uploadedImage);
                if (string.IsNullOrEmpty(imageUrl))
                {
                    return BadRequest("Image upload failed.");
                }

                // Save the imgbb link in the database
                post.PostImage = imageUrl;

                _postRepository.CreatePost(post);

                return CreatedAtAction(nameof(GetPostById), new { id = post.PostId }, post);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        

        [HttpPost("updatePost")]
        public async Task<IActionResult> UpdatePostAsync([FromForm] PostDTOU postDTOU, IFormFile uploadedImage = null)
        {
            if (postDTOU == null)
            {
                return BadRequest("Invalid Post data");
            }

            try
            {
                // Get the current time in Vietnam timezone
                TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
                DateTime utcNow = DateTime.UtcNow;
                DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

                // Retrieve the existing post
                var existingPost = _postRepository.GetPostById(postDTOU.PostId);
                if (existingPost == null)
                {
                    return NotFound($"Post with ID {postDTOU.PostId} not found.");
                }

                // Update the text fields of the post
                existingPost.UserId = postDTOU.UserId;
                existingPost.PostContent = postDTOU.PostContent;
                existingPost.UpdatedAt = postDTOU.UpdatedAt ?? currentVietnamTime;

                // Handle image upload if a new image is provided
                if (uploadedImage != null && uploadedImage.Length > 0)
                {
                    // Upload the new image to imgbb
                    string imageUrl = await UploadImageToImgbb(uploadedImage);
                    if (string.IsNullOrEmpty(imageUrl))
                    {
                        return BadRequest("Image upload failed.");
                    }

                    // Optionally: Delete the existing image from imgbb if it has been replaced
                    if (!string.IsNullOrEmpty(existingPost.PostImage))
                    {
                        await DeleteImageFromImgbb(existingPost.PostImage);
                    }

                    // Update the PostImage property with the new URL
                    existingPost.PostImage = imageUrl;
                }

                // Update the post in the repository
                _postRepository.UpdatePost(existingPost);

                return Ok(new { message = "Post updated successfully", updatedPost = existingPost });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Xóa Post
        [HttpDelete("deletePost")]
        public IActionResult DeletePost(int id)
        {
            try
            {
                var post = _postRepository.GetPostById(id);
                if (post == null)
                {
                    return NotFound($"Post with ID {id} not found.");
                }

                if (!string.IsNullOrEmpty(post.PostImage))
                {
                     DeleteImageFromImgbb(post.PostImage);
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
                    return NotFound($"Post with ID {id} not found.");
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

        // Helper method to extract the file ID from the Google Drive URL
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
