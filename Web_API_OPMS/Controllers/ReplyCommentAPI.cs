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
    public class ReplyCommentAPI : ControllerBase
    {
        private readonly IReplyCommentRepository _reply;
        public ReplyCommentAPI(IReplyCommentRepository reply)
        {
            _reply = reply;
        }
        [HttpGet("getReplyComment")]
        public ActionResult<IEnumerable<ReplyComment>> GetReplyComment()
        {
            var reply = _reply.GetReplyComments();
            if (reply == null)
            {
                return NotFound(new { message = "Không có bình luận  nào được tìm thấy." });
            }
            return Ok(reply);
        }
        [HttpGet("getReplyCommentById")]
        public ActionResult<Comment> GetReplyCommentById(int id)
        {
            var reply = _reply.GetReplyCommentById(id);
            if (reply == null)
            {
                return NotFound(new { message = "Không tồn tại bình luận." });
            }
            return Ok(reply);
        }
        [HttpGet("getReplyCommentByCommentId")]
        public ActionResult<IEnumerable<ReplyComment>> GetReplyCommentByCommentId(int commentId)
        {
            var comment = _reply.GetReplyCommentByCommentId(commentId);

            if (comment == null || !comment.Any())
            {
                return NotFound(new { message = "No comment found for the specified comment." });
            }

            return Ok(comment);
        }
        [HttpPost("createReplyComment")]
        public async Task<IActionResult> CreateReplyCommentAsync([FromBody] ReplyCommentDTO replycommentDTO)
        {
            if (replycommentDTO == null)
            {
                return BadRequest("Invalid reply data");
            }

            try
            {
                // Lấy giờ hiện tại theo giờ Việt Nam (GMT+7)
                TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
                DateTime utcNow = DateTime.UtcNow;
                DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

                ReplyComment reply = new ReplyComment()
                {
                    ReplyCommentId = replycommentDTO.ReplyCommentId,
                    UserId = replycommentDTO.UserId,
                    CommentId = replycommentDTO.CommentId,
                    ReplyCommentContent = replycommentDTO.ReplyCommentContent,
                    CreateAt = currentVietnamTime,                   
                };
                _reply.CreateReplyComment(reply);
                return CreatedAtAction(nameof(GetReplyCommentById), new { id = reply.ReplyCommentId }, reply);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpPost("updateReplyComment")]
        public async Task<IActionResult> UpdateReplyCommentAsync([FromBody] ReplyCommentDTO replycommentDTO)
        {
            if (replycommentDTO == null)
            {
                return BadRequest("Invalid Reply data");
            }

            try
            {
                // Get the current time in Vietnam (GMT+7)
                TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
                DateTime utcNow = DateTime.UtcNow;
                DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

                // Retrieve the existing reply comment
                var existingReplyComment = _reply.GetReplyCommentById(replycommentDTO.ReplyCommentId);
                if (existingReplyComment == null)
                {
                    return NotFound($"Reply with ID {replycommentDTO.ReplyCommentId} not found.");
                }

                // Remove the existing reply comment
                _reply.DeleteReplyComment(existingReplyComment.ReplyCommentId);

                // Create a new reply comment with updated keys
                var newReplyComment = new ReplyComment
                {
                    
                    UserId = replycommentDTO.UserId,
                    CommentId = replycommentDTO.CommentId,
                    ReplyCommentContent = replycommentDTO.ReplyCommentContent,
                    CreateAt = replycommentDTO.CreateAt ?? currentVietnamTime
                };

                _reply.CreateReplyComment(newReplyComment);

                return Ok(new { message = "Reply updated successfully with new ID", updatedReplyComment = newReplyComment });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpDelete("deleteReplyComment")]
        public IActionResult DeleteReplyComment(int id)
        {
            try
            {
                var reply = _reply.GetReplyCommentById(id);
                if (reply == null)
                {
                    return NotFound($"Comment with ID {id} not found.");
                }

                _reply.DeleteReplyComment(id);

                return Ok(new { message = "Comment deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
