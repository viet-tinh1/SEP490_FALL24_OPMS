using BusinessObject.Models;
using DataAccess.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Repositories.Implements;
using Repositories.Interface;
using System.Data;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Web_API_OPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShoppingCartAPI : ControllerBase
    {
        private PlantRepository PlantRepository = new PlantRepository();
        private ShoppingCartItemRepository ShoppingCartItemRepository = new ShoppingCartItemRepository();
        private ShoppingCartRepository ShoppingCartRepository = new ShoppingCartRepository();
        private readonly Db6213Context _context;

        public ShoppingCartAPI(Db6213Context context)
        {
            _context = context;
        }

        //Lấy danh sách Cart
        [HttpGet("getShoppingCart")]
        public ActionResult<IEnumerable<ShoppingCartItem>> getShoppingCart()
        {
            return ShoppingCartItemRepository.GetCarts();
        }

        [HttpGet("getShoppingCartByUser")]
        public ActionResult<IEnumerable<ShoppingCart>> GetShoppingCartByUser([FromQuery] int userId)
        {
            // If userId is not provided
            if (userId == 0)
            {
                return BadRequest(new { message = "User ID is required." });
            }

            // Retrieve the shopping cart for the user
            var shoppingCart = ShoppingCartRepository.GetCartUsersByUserId(userId);

            if (shoppingCart == null || !shoppingCart.Any())  // Kiểm tra danh sách có rỗng hay không
            {
                return BadRequest(new { message = "No carts found for the given user." });
            }

            // Lấy danh sách các CartId từ CartUser
            var cartIds = shoppingCart.Select(cu => cu.ShoppingCartItemId).ToList(); // Chọn CartId từ CartUser

            // Lấy danh sách các Cart từ bảng Cart dựa trên các CartId
            var carts = ShoppingCartItemRepository.GetCartById(cartIds);

            return Ok(carts);
        }
        //Tạo 1 Cart  mới
        [HttpPost("createShoppingCart")]
        public IActionResult CreateShoppingCartAsync([FromBody] ShoppingCartItemDTO c)
        {
            if (c == null)
            {
                return BadRequest("Invalid Cart data");
            }

            // Nếu UserId không được nhập hoặc bằng 0, gán giá trị mặc định là 1
            var userId = c.UserId.HasValue && c.UserId.Value != 0 ? c.UserId.Value : 1;

            try
            {
                var plant = PlantRepository.getPlantById(c.PlantId);

                if (plant == null)
                {
                    return NotFound("Plant not found.");
                }

                // Check if enough stock is available
                if (plant.Stock < c.Quantity)
                {
                    return BadRequest("Not enough stock available.");
                }

                // Create the cart item
                ShoppingCartItem cart = new ShoppingCartItem()
                {
                    ShoppingCartItemId = c.ShoppingCartItemId,
                    PlantId = c.PlantId,
                    Quantity = c.Quantity
                };
                ShoppingCartItemRepository.CreateCart(cart);

                // Create the shopping cart với UserId đã kiểm tra
                ShoppingCart shoppingCart = new ShoppingCart()
                {
                    ShoppingCartItemId = cart.ShoppingCartItemId,
                    UserId = userId // Gán giá trị UserId đã kiểm tra
                };
                ShoppingCartRepository.CreateCartUser(shoppingCart);

                return CreatedAtAction(nameof(GetShoppingCartById), new { id = cart.ShoppingCartItemId }, cart);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        // Chỉnh sửa Cart đã tạo
        [HttpPost("updateShoppingCart")]
        public IActionResult UpdateShoppingCart([FromBody] ShoppingCartItemDTO c)
        {
            if (c == null)
            {
                return BadRequest("Invalid Cart data");
            }

            try
            {

                var existingCart = ShoppingCartItemRepository.GetSingleCartById(c.ShoppingCartItemId);
                if (existingCart == null)
                {
                    return NotFound($"Cart not found");
                }

                // Update the existing cart properties
               
                existingCart.ShoppingCartItemId = c.ShoppingCartItemId;
                existingCart.PlantId = c.PlantId;
                existingCart.Quantity = c.Quantity;

                // Save changes
                ShoppingCartItemRepository.UpdateCart(existingCart);

                return NoContent(); // 204 No Content on successful update
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        //Xóa 1 Cart 
        [HttpGet("deleteShoppingCart")]
        public IActionResult DeleteShoppingCart(int CartId)
        {
            try
            {
                // Xóa tất cả các bản ghi trong bảng CartUser liên quan đến CartId
                ShoppingCartRepository.DeleteCartUser(CartId);

                // Xóa cart khỏi bảng Cart
                ShoppingCartItemRepository.DeleteCart(CartId);

                return NoContent(); // Trả về phản hồi không có nội dung
            }
            catch (Exception ex)
            {
                // Xử lý lỗi nếu có vấn đề trong quá trình xóa
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpGet("getShoppingCartById")]
        public ActionResult<ShoppingCartItem> GetShoppingCartById(int id)
        {
            var cart = ShoppingCartItemRepository.GetSingleCartById(id);

            if (cart == null)
            {
                return NotFound(); // Return 404 if the cart isn't found
            }

            return Ok(cart); // Return 200 with the cart data
        }

    }
}
