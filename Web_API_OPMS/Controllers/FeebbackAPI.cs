using BusinessObject.Models;
using DataAccess.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories.Implements;
using Repositories.Interface;

namespace Web_API_OPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeebbackAPI : ControllerBase
    {
        private readonly IFeedbackRepository _feedbackRepository;
        public FeebbackAPI(IFeedbackRepository feedbackRepository)
        {
            _feedbackRepository = feedbackRepository;
        }
        [HttpGet("getFeedback")]
        public ActionResult<IEnumerable<Feedback>> GetFeedback()
        {
            var feedback = _feedbackRepository.GetFeedbacks();
            if (feedback == null)
            {
                return NotFound(new { message = "Không có phản hồi nào được tìm thấy." });
            }
            return Ok(feedback);
        }
        [HttpGet("getFeedbackById")]
        public ActionResult<Feedback> GetFêdbackById(int Id)
        {
            var feedback = _feedbackRepository.GetFeedbackById(Id);
            if (feedback == null)
            {
                return NotFound(new { message = "Không tồn tại bình luận." });
            }
            return Ok(feedback);
        }
        [HttpPost("createFeedback")]
        public async Task<IActionResult> CreateFeedbackAsync([FromBody] FeebbackDTO feedbackDTO)
        {
            if (feedbackDTO == null)
            {
                return BadRequest("Invalid comment data");
            }

            try
            {
                // Lấy giờ hiện tại theo giờ Việt Nam (GMT+7)
                TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
                DateTime utcNow = DateTime.UtcNow;
                DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

                Feedback feedback = new Feedback()
                {
                    Name = feedbackDTO.Name,
                    Email = feedbackDTO.Email,
                    FeedbackText = feedbackDTO.FeedbackText,
                    Rating = feedbackDTO.Rating,
                    CreatedAt = currentVietnamTime,
                };


                _feedbackRepository.CreateFeedback(feedback);

                return CreatedAtAction(nameof(GetFêdbackById), new { id = feedback.FeedbackId }, feedback);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}
