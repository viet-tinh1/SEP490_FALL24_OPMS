using BusinessObject.Models;
using DataAccess.DAO;
using DataAccess.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories.Implements;
using Repositories.Interface;

namespace Web_API_OPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentAPI : ControllerBase
    {
        private readonly ICommentRepository _commentRepository;

        public CommentAPI(ICommentRepository commentRepository)
        {
            _commentRepository = commentRepository;
        }
        [HttpGet("getComment")]
        public ActionResult<IEnumerable<Comment>> GetComment() 
        {
            var comment  = _commentRepository.GetComments();
            if (comment == null)
            {
                return NotFound(new { message = "Không có bình luận  nào được tìm thấy." });
            }
            return Ok(comment);
        }
        [HttpGet("getCommentById")]
        public ActionResult<Comment> GetCommentById(int commentId)
        {
            var comment = _commentRepository.GetCommentById(commentId);
            if (comment == null)
            {
                return NotFound(new { message = "Không tồn tại bình luận." });
            }
            return Ok(comment);
        }
        [HttpGet("getCommentByPostId")]
        public ActionResult<IEnumerable<Comment>> GetCommentByPostId(int postId)
        {
            var comment = _commentRepository.GetCommentByPostId(postId);

            if (comment == null || !comment.Any())
            {
                return NotFound(new { message = "No comment found for the specified post." });
            }

            return Ok(comment);
        }
        [HttpPost("createComment")]
        public async Task<IActionResult> CreateCommentAsync([FromBody] CommentDTO commentDTO)
        {
            if (commentDTO == null)
            {
                return BadRequest("Invalid comment data");
            }

            try
            {
                // Lấy giờ hiện tại theo giờ Việt Nam (GMT+7)
                TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
                DateTime utcNow = DateTime.UtcNow;
                DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

                Comment comment = new Comment()
                {
                    PostId = commentDTO.PostId,
                    UserId = commentDTO.UserId,
                    CommentId = commentDTO.CommentId,
                    CommentsContent = commentDTO.CommentsContent,
                    LikeComment = 0,
                    CommentTime = currentVietnamTime,
                    UpdatedAt = currentVietnamTime,
                };
                

                _commentRepository.CreateComment(comment);

                return CreatedAtAction(nameof(GetCommentById), new { id = comment.CommentId }, comment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpPost("updateComment")]
        public async Task<IActionResult> UpdateCommentAsync([FromBody] ComentDTOU commentDTOU)
        {
            if (commentDTOU == null)
            {
                return BadRequest("Invalid comment data");
            }

            try
            {
                // Lấy giờ hiện tại theo giờ Việt Nam (GMT+7)
                TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
                DateTime utcNow = DateTime.UtcNow;
                DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);
                var existingComment = _commentRepository.GetCommentById(commentDTOU.CommentId);
                if (existingComment == null)
                {
                    return NotFound($"Comment with ID {commentDTOU.CommentId} not found.");
                }

                // Cập nhật các thuộc tính của Comment
                existingComment.UserId = commentDTOU.UserId;
                existingComment.PostId = commentDTOU.PostId;
                existingComment.CommentId = commentDTOU.CommentId;
                existingComment.CommentsContent = commentDTOU.CommentsContent;
                existingComment.UpdatedAt = commentDTOU.UpdatedAt ?? currentVietnamTime;


                _commentRepository.UpdateComment(existingComment);

                return Ok(new { message = "comment updated successfully", updatedComment = existingComment });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpDelete("deleteComment")]
        public IActionResult DeleteComment(int id)
        {
            try
            {
                var comment = _commentRepository.GetCommentById(id);
                if (comment == null)
                {
                    return NotFound($"Comment with ID {id} not found.");
                }

                _commentRepository.DeleteComment(id);

                return Ok(new { message = "Comment deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPost("likeComment")]
        public IActionResult LikeComment(int id)
        {
            try
            {
                var comment = _commentRepository.GetCommentById(id);
                if (comment == null)
                {
                    return NotFound($"Comment with ID {id} not found.");
                }
                comment.LikeComment += 1;
                _commentRepository.UpdateComment(comment);

                return Ok(new { message = "Like post successfully", comment });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
