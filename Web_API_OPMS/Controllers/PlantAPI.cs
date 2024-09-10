using BusinessObject.Models;
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
        public IActionResult createPlant(Plant p)
        {
            Plant plant = new Plant()
            {
                PlantName = p.PlantName,
                CategoryId = p.CategoryId,
                Description = p.Description,
                Price = p.Price,
                ImageUrl = p.ImageUrl,
                Stock = p.Stock,
                Status = p.Status
            };
            plantRepository.createPlant(plant);
            return NoContent();
        }
        // Chỉnh sửa plant đã tạo
        [HttpPost("updatePlant")]
        public IActionResult updatePlant(Plant p)
        {
            Plant plant = new Plant()
            {
                PlantName = p.PlantName,
                CategoryId = p.CategoryId,
                Description = p.Description,
                Price = p.Price,
                ImageUrl = p.ImageUrl,
                Stock = p.Stock,
                Status = p.Status
            };
            plantRepository.updatePlant(plant);
            return NoContent();
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
