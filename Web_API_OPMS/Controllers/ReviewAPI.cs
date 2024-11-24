
using BusinessObject.Models;
using DataAccess.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        private readonly Db6213Context _context;
        public ReviewAPI(IReviewRepository reviewRepository,Db6213Context context)
        {
            _reviewRepository = reviewRepository;
            _context = context;
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
        /// <summary>
        /// review khi cây đó có 1 đơn đã hoàn thành 
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="plantId"></param>
        /// <returns></returns>
        [HttpGet("canReview")]
        public IActionResult CanUserReview(int userId, int plantId)
        {
            try
            {
                // Truy xuất thông tin từ bảng Order và ShoppingCartItem
                var hasPurchased = _context.Orders
                    .Include(o => o.ShoppingCartItem)
                    .Any(o => o.UserId == userId
                              && o.ShoppingCartItem.PlantId == plantId
                              && o.Status == "Success"); // Đơn đã hoàn thành

                if (hasPurchased)
                {
                    return Ok(new { canReview = true });
                }

                return Ok(new { canReview = false });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi kiểm tra quyền.", error = ex.Message });
            }
        }
        /// <summary>
        /// review khi tất cả đơn về cây đó đc hoàn thành 
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="plantId"></param>
        /// <returns></returns>
        //[HttpGet("canReview")]
        //public IActionResult CanUserReview(int userId, int plantId)
        //{
        //    try
        //    {
        //        // Truy xuất danh sách các đơn hàng liên quan đến người dùng và sản phẩm
        //        var orders = _context.Orders
        //            .Include(o => o.ShoppingCartItem)
        //            .Where(o => o.UserId == userId && o.ShoppingCartItem.PlantId == plantId)
        //            .ToList();

        //        // Nếu không có đơn hàng nào thì không thể review
        //        if (!orders.Any())
        //        {
        //            return Ok(new { canReview = false, message = "Không có đơn hàng nào liên quan đến sản phẩm này." });
        //        }

        //        // Kiểm tra nếu tất cả các đơn hàng đều có trạng thái "Success"
        //        var allCompleted = orders.All(o => o.Status == "Success");

        //        if (allCompleted)
        //        {
        //            return Ok(new { canReview = true });
        //        }

        //        return Ok(new { canReview = false, message = "Bạn cần hoàn thành tất cả các đơn hàng liên quan đến sản phẩm này để đánh giá." });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { message = "Đã xảy ra lỗi khi kiểm tra quyền.", error = ex.Message });
        //    }
        //}
    }
}

