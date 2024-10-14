using BusinessObject.Models;
using Microsoft.AspNetCore.Mvc;
using Repositories.Interface;
using System.Collections.Generic;

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

        // Các phương thức khác...

        // Phương thức lấy các Review theo PlantId.
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
    }
}
