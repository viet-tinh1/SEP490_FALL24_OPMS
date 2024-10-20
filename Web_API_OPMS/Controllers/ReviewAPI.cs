
using BusinessObject.Models;
using DataAccess.DTO;
using Microsoft.AspNetCore.Mvc;
using Repositories.Interface;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Web_API_OPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewAPI : ControllerBase
    {
        private readonly IReviewRepository _reviewRepository;

        public ReviewAPI(IReviewRepository reviewRepository)
        {
            _reviewRepository = reviewRepository;
        }

        // Lấy danh sách Review
        [HttpGet("getReviews")]
        public ActionResult<IEnumerable<Review>> GetReviews()
        {
            var reviews = _reviewRepository.GetReviews();
            if (reviews == null || !reviews.Any())
            {
                return NotFound(new { message = "Không có đánh giá nào được tìm thấy." });
            }

            return Ok(reviews);
        }

        // Lấy Review theo Id
        [HttpGet("getReviewById")]
        public ActionResult<Review> GetReviewById(int id)
        {
            var review = _reviewRepository.GetReviewById(id);

            if (review == null)
            {
                return NotFound(new { message = "Review not found" });
            }

            return Ok(review);
        }

        // Lấy Review theo tên người dùng
        [HttpGet("getReviewsByUserId")]
        public ActionResult<IEnumerable<Review>> GetReviewsByUserId(int userId)
        {
            var reviews = _reviewRepository.GetReviewsByUserId(userId);

            if (reviews == null || !reviews.Any())
            {
                return NotFound(new { message = "No reviews found for the specified user." });
            }

            return Ok(reviews);
        }

        // Tạo 1 Review mới
        [HttpPost("createReview")]
        public IActionResult CreateReview([FromBody] ReviewDTO reviewDTO)
        {
            if (reviewDTO == null)
            {
                return BadRequest("Invalid review data");
            }

            try
            {
                // Lấy giờ hiện tại theo giờ Việt Nam (GMT+7)
                TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
                DateTime utcNow = DateTime.UtcNow;
                DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

                Review review = new Review()
                {
                    ReviewId = reviewDTO.ReviewId,
                    UserId = reviewDTO.UserId,
                    PlantId = reviewDTO.PlantId,
                    Rating = reviewDTO.Rating,
                    Comment = reviewDTO.Comment,
                    ReviewDate = currentVietnamTime
                };

                _reviewRepository.CreateReview(review);

                return CreatedAtAction(nameof(GetReviewById), new { id = review.ReviewId }, review);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Chỉnh sửa Review đã tạo
        [HttpPost("updateReview")]
        public IActionResult UpdateReview([FromBody] ReviewDTOU reviewDTOU)
        {
            if (reviewDTOU == null)
            {
                return BadRequest("Invalid review data");
            }

            try
            {
                // Lấy giờ hiện tại theo giờ Việt Nam (GMT+7)
                TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
                DateTime utcNow = DateTime.UtcNow;
                DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);
                var existingReview = _reviewRepository.GetReviewById(reviewDTOU.ReviewId);
                if (existingReview == null)
                {
                    return NotFound($"Review with ID {reviewDTOU.ReviewId} not found.");
                }

                // Cập nhật các thuộc tính của review
                existingReview.UserId = reviewDTOU.UserId;
                existingReview.PlantId = reviewDTOU.PlantId;
                existingReview.Rating = reviewDTOU.Rating;
                existingReview.Comment = reviewDTOU.Comment;
                existingReview.ReviewDate = reviewDTOU.ReviewDate ?? currentVietnamTime;

                _reviewRepository.UpdateReview(existingReview);

                return Ok(new { message = "Review updated successfully", updatedReview = existingReview });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Xóa Review
        [HttpDelete("deleteReview")]
        public IActionResult DeleteReview(int id)
        {
            try
            {
                var review = _reviewRepository.GetReviewById(id);
                if (review == null)
                {
                    return NotFound($"Review with ID {id} not found.");
                }

                _reviewRepository.DeleteReview(id);

                return Ok(new { message = "Review deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Lấy Review theo PlantId
        [HttpGet("getReviewsByPlantId")]
        public ActionResult<IEnumerable<Review>> GetReviewsByPlantId(int plantId)
        {
            var reviews = _reviewRepository.GetReviewsByPlantId(plantId);
            if (reviews == null || reviews.Count == 0)
            {
                return NotFound(new { message = "No reviews found for this plant." });
            }

            return Ok(reviews);
        }

        // Lấy tổng số lượng review và tổng số sao của sản phẩm
        [HttpGet("getProductRatingSummary")]
        public ActionResult GetProductRatingSummary(int plantId)
        {
            try
            {

                var reviews = _reviewRepository.GetReviewsByPlantId(plantId);

                if (reviews == null || !reviews.Any())
                {
                    return NotFound(new { message = "No reviews found for this product." });
                }

                // Tính tổng số lượng review và tổng số sao
                var totalReviews = reviews.Count();
                var totalRating = reviews.Sum(r => r.Rating);

                return Ok(new { totalReviews, totalRating });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
