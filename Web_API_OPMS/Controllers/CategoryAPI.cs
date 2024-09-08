using BusinessObject.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories.Implements;
using Repositories.Interface;

namespace Web_API_OPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryAPI : ControllerBase
    {
        private ICategoryRepository repository = new CategoryRepository();
        // lấy danh sách Category
        [HttpGet("getCategory")]
        public ActionResult<IEnumerable<Category>> GetCategory() => repository.GetCategory();
    }
}
