using BusinessObject.Models;
using DataAccess.DAO;
using DataAccess.DTO;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
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
        private readonly IConfiguration _configuration;
        public PlantAPI(Db6213Context context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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
        public async Task<IActionResult> CreatePlantAsync([FromForm] PlantDTO p, IFormFile uploadedImage = null)
        {
            if (p == null || string.IsNullOrEmpty(p.PlantName) || (uploadedImage == null && string.IsNullOrEmpty(p.ImageUrl)))
            {
                return BadRequest("Invalid plant data");
            }

            try
            {
                // Set Vietnam timezone
                TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
                DateTime utcNow = DateTime.UtcNow;
                DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

                // Create new plant object
                Plant plant = new Plant()
                {
                    UserId = p.UserId,
                    PlantName = p.PlantName,
                    CategoryId = p.CategoryId,
                    Description = p.Description,
                    Price = p.Price,
                    Stock = p.Stock,
                    Status = p.Status,
                    IsVerfied = 0,
                    Discount = p.Discount,
                    CreateDate = currentVietnamTime
                };

                // Handle image upload or URL
                string imageUrl = await UploadImageToImgbb(uploadedImage);
                if (string.IsNullOrEmpty(imageUrl))
                {
                    return BadRequest("Image upload failed.");
                }

                plant.ImageUrl = imageUrl;
                plantRepository.createPlant(plant);

                return CreatedAtAction(nameof(getPlantById), new { id = plant.PlantId }, plant);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpPost("updatePlant")]
        public async Task<IActionResult> UpdatePlantAsync([FromForm] PlantDTOU p, IFormFile uploadedImage = null)
        {
            if (p == null || string.IsNullOrEmpty(p.PlantName))
            {
                return BadRequest("Invalid plant data");
            }

            try
            {
                // Find the existing plant
                var existingPlant = plantRepository.getPlantById(p.PlantId);
                if (existingPlant == null)
                {
                    return NotFound($"Plant with name {p.PlantName} not found.");
                }
                if (p.UserId != existingPlant.UserId)
                {
                    return Unauthorized(new { message = "You do not have permission to update this plant." });
                }

                // Update plant properties
                existingPlant.UserId = p.UserId;
                existingPlant.PlantName = p.PlantName;
                existingPlant.CategoryId = p.CategoryId;
                existingPlant.Description = p.Description;
                existingPlant.Price = p.Price;
                existingPlant.Stock = p.Stock;
                existingPlant.IsVerfied = 0;

                // Handle image update
                if (uploadedImage != null && uploadedImage.Length > 0)
                {
                    // Upload the new image to imgbb
                    string imageUrl = await UploadImageToImgbb(uploadedImage);
                    if (string.IsNullOrEmpty(imageUrl))
                    {
                        return BadRequest("Image upload failed.");
                    }

                    // Optionally: Delete the existing image from imgbb if it has been replaced
                    if (!string.IsNullOrEmpty(existingPlant.ImageUrl))
                    {
                        await DeleteImageFromImgbb(existingPlant.ImageUrl);
                    }

                    // Update the PostImage property with the new URL
                    existingPlant.ImageUrl = imageUrl;
                }

                // Set status based on stock
                existingPlant.Status = p.Status;

                plantRepository.updatePlant(existingPlant);

                return Ok(new { message = $"Plant '{existingPlant.PlantName}' has been successfully updated.", updatedPlant = existingPlant });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpPost("updateVerifyStatus")]
        public IActionResult UpdateVerifyStatus(int plantId)
        {
            
            try
            {
                // Find the existing plant by its ID
                var existingPlant = plantRepository.getPlantById(plantId);
                if (existingPlant == null)
                {
                    return NotFound(new { message = $"Plant with ID {plantId} not found." });
                }

                // Check if the plant is already verified
                if (existingPlant.IsVerfied == 1)
                {
                    return BadRequest(new { message = $"Plant'{existingPlant.PlantName}' is already verified." });
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
        [HttpPost("updateStatus")]
        public IActionResult UpdateStatus(int plantId)
        {
            try
            {
                // Find the existing user by their ID
                var existingPlant = plantRepository.getPlantById(plantId);
                if (existingPlant == null)
                {
                    return NotFound($"Plant with ID {plantId} not found.");
                }

                // Toggle the user's status
                existingPlant.Status = existingPlant.Status == 0 ? 1 : 0;

                // Save changes to the repository
                plantRepository.updatePlant(existingPlant);

                // Return success message with the new status
                return Ok($"User '{existingPlant.PlantName}' status has been set to {(existingPlant.Status == 1 ? "verified" : "unverified")}.");
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
            if (!string.IsNullOrEmpty(deletePlant.ImageUrl))
            {
                DeleteImageFromImgbb(deletePlant.ImageUrl);
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

        public IActionResult SearchPlants([FromQuery] int? limit  = null,[FromQuery] string name = null, [FromQuery] List<int> categoryId = null, [FromQuery] decimal? minPrice = null, [FromQuery] decimal? maxPrice = null, [FromQuery] int? sortOption = null)
        {
            categoryId ??= new List<int>();           
            var plants = plantRepository.searchPlants(limit,name, categoryId, minPrice, maxPrice, sortOption);
            return Ok(plants);
        }
        [HttpGet("searchPlantsByShop")]
        public IActionResult SearchPlantsByShop([FromQuery] int userId, string name = null, [FromQuery] List<int> categoryId = null, [FromQuery] decimal? minPrice = null, [FromQuery] decimal? maxPrice = null, [FromQuery] int? sortOption = null,[FromQuery] int? limit = null)
        {
            categoryId ??= new List<int>();
            var plants = plantRepository.SearchPlantsByShop(userId, name, categoryId, minPrice, maxPrice, sortOption,limit);
            return Ok(plants);
        }

        [HttpGet("most-purchased")]
        public async Task<IActionResult> GetMostPurchasedPlants([FromQuery] int limit)
        {
            var plants = await plantRepository.GetMostPurchasedPlantsFromShoppingCartAsync(limit);
            return Ok(plants); // Trả về danh sách PlantDTOS
        }

        //[HttpGet("most-purchased-by-shop")]
        //public async Task<IActionResult> GetMostPurchasedPlantsByShop([FromQuery] int limit, int userId)
        //{
        //    var plants = await plantRepository.GetMostPurchasedPlantsByShopFromShoppingCartAsync(limit,userId);
        //    return Ok(plants); // Trả về danh sách PlantDTOS
        //}
        [HttpGet("getPlantByUser")]
        public ActionResult<IEnumerable<Plant>> getPlantByUser(int UserId)
        {
            return plantRepository.getPlantByUser(UserId);
        }
        [HttpGet("getPlantByUserIsVerify")]
        public ActionResult<IEnumerable<Plant>> getPlantByUserIsVerify(int UserId)
        {
            return plantRepository.getPlantByUserIsVerify(UserId);
        }
        private async Task<byte[]> GetImageBytesFromUrl(string imageUrl)
        {
            using (HttpClient client = new HttpClient())
            {
                return await client.GetByteArrayAsync(imageUrl);
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
    }
}
