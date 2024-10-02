using BusinessObject.Models;
using DataAccess.DAO;
using DataAccess.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Repositories.Implements;
using Repositories.Interface;

namespace Web_API_OPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlantAPI : ControllerBase
    {
        private UserRepository UserRepository = new UserRepository();
        private PlantRepository plantRepository = new PlantRepository();
        private readonly Db6213Context _context;

        public PlantAPI(Db6213Context context)
        {
            _context = context;
        }
        //Lấy danh sách plant
        [HttpGet("getPlants")]
        public ActionResult<IEnumerable<Plant>> getPlant()
        {
            return plantRepository.getPlant();
        }
        // get all plant have verify 
        [HttpGet("getVerifiedPlants")]
        public ActionResult<IEnumerable<Plant>> getVerifiedPlants()
        {
            var verifiedPlants = plantRepository.getVerifiedPlants();

            // Check if there are any verified plants
            if (verifiedPlants == null || !verifiedPlants.Any())
            {
                // Return a custom message if no verified plants are found
                return Ok(new {message= "No plants available currently." });
            }

            // Return the list of verified plants if they exist
            return Ok(verifiedPlants);
        }
        //get all plant haven't verify
        [HttpGet("getNonVerifiedPlants")]
        public ActionResult<IEnumerable<Plant>> GetNonVerifiedPlants()
        {
            // Check if the user is logged in by checking the session
            var userId = HttpContext.Session.GetInt32("UserId");

            if (userId == null) // If the user is not logged in or session expired
            {
                return Unauthorized(new { message = "User not logged in" });
            }

            // Optional: Check if the user has the correct role (only users with certain roles can access this)
            var user = UserRepository.GetUserById(userId.Value);

            // Allow access only if the user has role 1 (admin or manager role)
            if (user.Roles != 1)
            {
                return Unauthorized(new { message = "You do not have permission to view non-verified plants." });
            }

            // Fetch and return the non-verified plants
            try
            {
                var nonVerifiedPlants = plantRepository.getNonVerifiedPlants();
                return Ok(nonVerifiedPlants); // Return the list of non-verified plants
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message); // Handle any potential errors
            }
        }
        //Tạo 1 plant mới
        [HttpPost("createPlant")]
        public IActionResult CreatePlant([FromBody] PlantDTO p)
        {
            //using session userId from login api 
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)// If the user is not logged in or session expired
            {
                return Unauthorized(new { message = "User not logged in" });
            }
            if (p == null || string.IsNullOrEmpty(p.PlantName))
            {
                return BadRequest("Invalid plant data");
            }

            try
            {              
                Plant plant = new Plant()
                {
                    UserId = userId.Value,
                    PlantName = p.PlantName,
                    CategoryId = p.CategoryId,
                    Description = p.Description,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    Stock = p.Stock,
                    Status = p.Status,
                    IsVerfied = 0
                };
                plantRepository.createPlant(plant);
                return CreatedAtAction(nameof(CreatePlant), new { id = plant.PlantId}, plant);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        // Chỉnh sửa plant đã tạo
        [HttpPost("updatePlant")]
        public IActionResult UpdatePlant([FromBody] PlantDTOU p)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)// If the user is not logged in or session expired
            {
                return Unauthorized(new { message = "User not logged in" });
            }
            if (p == null || string.IsNullOrEmpty(p.PlantName))
            {
                return BadRequest("Invalid plant data");
            }
            
            try
            {
                // Find the existing plant in the repository
                var existingPlant = plantRepository.getPlantById(p.PlantId);
                if (existingPlant == null)
                {
                    return NotFound($"Plant with name {p.PlantName} not found.");
                }
                if(userId != existingPlant.UserId)
                {
                    return Unauthorized(new { message = "You do not have permission to update " });
                }
                // Update the existing plant's properties
                existingPlant.UserId = p.UserId;
                existingPlant.PlantName = p.PlantName;
                existingPlant.CategoryId = p.CategoryId;
                existingPlant.Description = p.Description;
                existingPlant.Price = p.Price;
                existingPlant.ImageUrl = p.ImageUrl;
                existingPlant.Stock = p.Stock;
                existingPlant.Status = p.Status;
                

                // Save changes
                plantRepository.updatePlant(existingPlant);

                return Ok($"Plant '{existingPlant.PlantName}' has been successfully Update.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpPost("updateVerifyStatus")]
        public IActionResult UpdateVerifyStatus(int plantId)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            
            if (userId == null)// If the user is not logged in or session expired
            {
                return Unauthorized(new { message = "User not logged in" });
            }
            var user = UserRepository.GetUserById(userId.Value);
            
            if (user.Roles != 1)
            {
                return Unauthorized(new { message = "You do not have permission to update the verification status." });
            }
            try
            {
                // Find the existing plant by its ID
                var existingPlant = plantRepository.getPlantById(plantId);
                if (existingPlant == null)
                {
                    return NotFound($"Plant with ID {plantId} not found.");
                }

                // Check if the plant is already verified
                if (existingPlant.IsVerfied == 1)
                {
                    return BadRequest($"Plant'{existingPlant.PlantName}' is already verified.");
                }

                // Update the verification status to 1 (verified)
                existingPlant.IsVerfied = 1;

                // Save changes to the repository
                plantRepository.updatePlant(existingPlant);

                return Ok($"Plant '{existingPlant.PlantName}' has been successfully verified."); 
                // Return 204 No Content on successful update
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpPost("updateNonVerifyStatus")]
        public IActionResult UpdateNonVerifyStatus(int plantId)
        {
            var userId = HttpContext.Session.GetInt32("UserId");

            if (userId == null)// If the user is not logged in or session expired
            {
                return Unauthorized(new { message = "User not logged in" });
            }
            var user = UserRepository.GetUserById(userId.Value);

            if (user.Roles != 1)
            {
                return Unauthorized(new { mesage = "You do not have permission to update the non-verification status." });
            }
            try
            {
                // Find the existing plant by its ID
                var existingPlant = plantRepository.getPlantById(plantId);
                if (existingPlant == null)
                {
                    return NotFound($"Plant with ID {plantId} not found.");
                }

                // Check if the plant is already verified
                if (existingPlant.IsVerfied == 0)
                {
                    return BadRequest($"Plant '{existingPlant.PlantName}' is already non-verified.");
                }

                // Update the verification status to 1 (verified)
                existingPlant.IsVerfied = 0;

                // Save changes to the repository
                plantRepository.updatePlant(existingPlant);

                return Ok($"Plant '{existingPlant.PlantName}' has been successfully set to non-verified.");
                // Return 204 No Content on successful update
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        //Xóa 1 plant 
        [HttpGet("deletePlant")]
        public IActionResult deletePlant(int plantId)
        {
            var userId = HttpContext.Session.GetInt32("UserId");

            if (userId == null)// If the user is not logged in or session expired
            {
                return Unauthorized(new { message = "User not logged in" });
            }
            var deletePlant = plantRepository.getPlantById(plantId);
            if (userId != deletePlant.UserId)
            {
                return Unauthorized(new { message = "You do not have permission to delete " });
            }
           
            plantRepository.deletePlant(plantId);
            return Ok($"Plant '{deletePlant.PlantName}' has been successfully detele.");
        }
        //Lấy 1 plant theo id
        [HttpGet("getPlantById")]
        public ActionResult<Plant> getPlantById(int id)
        {
            return plantRepository.getPlantById(id);
        }
        
        [HttpGet("searchPlants")]

        public IActionResult SearchPlants([FromQuery] string name = null, [FromQuery] List<int> categoryId = null, [FromQuery] decimal? minPrice = null, [FromQuery] decimal? maxPrice = null)
        {
            categoryId ??= new List<int>();

            // Kiểm tra nếu minPrice lớn hơn maxPrice
            if (minPrice.HasValue && maxPrice.HasValue && minPrice > maxPrice)
            {
                return BadRequest("Giá trị tối thiểu không thể lớn hơn giá trị tối đa.");
            }

            // Gọi phương thức tìm kiếm trong PlantRepository và truyền các tham số
            var plants = plantRepository.searchPlants(name, categoryId, minPrice, maxPrice);

            // Kiểm tra nếu không có kết quả
            if (plants == null || plants.Count == 0)
            {
                return NotFound("Không có kết quả theo yêu cầu.");
            }

            // Trả về kết quả dưới dạng JSON
            return Ok(plants);
        }

    }
}
