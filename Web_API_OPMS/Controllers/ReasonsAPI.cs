using BusinessObject.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories.Implements;
using Repositories.Interface;

namespace Web_API_OPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReasonsAPI : ControllerBase
    {
        private IReasonsRepository repository = new ReasonsRepository();
        // lấy danh sách GetReasons
        [HttpGet("getReasons")]
        public ActionResult<IEnumerable<Reason>> GetReasons() => repository.GetReasons();
    }
}
