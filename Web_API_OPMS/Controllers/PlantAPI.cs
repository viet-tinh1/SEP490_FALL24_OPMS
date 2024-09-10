using BusinessObject.Models;
using DataAccess.DAO;
using DataAccess.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories.Implements;

namespace Web_API_OPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlantAPI : ControllerBase
    {
        private PlantRepository plantRepository = new PlantRepository();
        //Lấy danh sách plant
        [HttpGet("getPlants")]
        public ActionResult<IEnumerable<Plant>> getPlant()
        {
            return plantRepository.getPlant();
        }
        //Tạo 1 plant mới
        [HttpPost("createPlant")]
        public IActionResult CreatePlant([FromBody] PlantDTO p)
        {
            if (p == null || string.IsNullOrEmpty(p.PlantName))
            {
                return BadRequest("Invalid plant data");
            }

            try
            {              
                Plant plant = new Plant()
                {
                    UserId = p.UserId,
                    PlantName = p.PlantName,
                    CategoryId = p.CategoryId,
                    Description = p.Description,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    Stock = p.Stock,
                    Status = p.Status
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
        public IActionResult UpdatePlant([FromBody] PlantDTO p)
        {
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

                return NoContent(); // 204 No Content on successful update
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
            plantRepository.deletePlant(plantId);
            return NoContent();
        }
        //Lấy 1 plant theo id
        [HttpGet("getPlantById")]
        public ActionResult<Plant> getPlantById(int id)
        {
            return plantRepository.getPlantById(id);
        }

        [HttpGet("SearchPlantByName")]
        public ActionResult<List<Plant>> searchPlantByName(string name)
        {
            return plantRepository.searchPlantByName(name);
        }
        [HttpGet("SearchPlantByCategory")]
        public ActionResult<List<Plant>> searchPlantByCategory(int categoryId)
        {
            return plantRepository.searchPlantByCategory(categoryId);
        }
    }
}
