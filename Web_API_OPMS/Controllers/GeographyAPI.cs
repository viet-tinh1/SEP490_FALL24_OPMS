using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories.Interface;

namespace Web_API_OPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GeographyAPI : ControllerBase
    {
        private readonly IGeographyRepository _geographyDataService;

        public GeographyAPI(IGeographyRepository geographyDataService)
        {
            _geographyDataService = geographyDataService;
        }
        [HttpGet]
        [Route("vietnam-geography")] // Định nghĩa rõ hơn đường dẫn API
        public async Task<IActionResult> GetVietnamGeographyData()
        {
            var jsonData = _geographyDataService.GetGeographyData();
            if (jsonData == null)
            {
                return NotFound("File data.json không tồn tại hoặc không thể đọc được.");
            }

            // Trả về dữ liệu từ bộ nhớ
            return Content(jsonData, "application/json");
        }
    }
}
