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

            try
            {
                // Lấy thông tin cây trồng
                var plant = PlantRepository.getPlantById(c.PlantId);

                if (plant == null)
                {
                    return NotFound("Plant not found.");
                }

                // Kiểm tra tồn kho
                if (plant.Stock < c.Quantity)
                {
                    return NotFound(new { message = "Not enough stock available."});
                }

                // Kiểm tra xem sản phẩm đã có trong giỏ hàng của người dùng chưa
                var existingCartItem = ShoppingCartItemRepository.GetCartItemByUserAndPlantId(c.UserId, c.PlantId);

                if (existingCartItem != null)
                {
                    // Nếu sản phẩm đã tồn tại, tăng số lượng
                    if (plant.Stock < (existingCartItem.Quantity + c.Quantity))
                    {
                        return NotFound(new { message = "Not enough stock available for the updated quantity."});
                    }

                    existingCartItem.Quantity += c.Quantity;
                    ShoppingCartItemRepository.UpdateCart(existingCartItem);
                }
                else
                {
                    // Nếu sản phẩm chưa có, tạo mục giỏ hàng mới
                    ShoppingCartItem cart = new ShoppingCartItem()
                    {
                        ShoppingCartItemId = c.ShoppingCartItemId,
                        PlantId = c.PlantId,
                        Quantity = c.Quantity
                    };
                    ShoppingCartItemRepository.CreateCart(cart);

                    // Tạo giỏ hàng với UserId
                    ShoppingCart shoppingCart = new ShoppingCart()
                    {
                        ShoppingCartItemId = cart.ShoppingCartItemId,
                        UserId = c.UserId
                    };
                    ShoppingCartRepository.CreateCartUser(shoppingCart);
                }

                return Ok(new { message = "Cart updated successfully." });
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
        // Áp dụng mã giảm giá cho Cart
        [HttpPost("applyDiscount")]
        public async Task<IActionResult> ApplyDiscount([FromQuery] int cartId, [FromQuery] decimal discountPercent)
        {
            if (discountPercent < 0 || discountPercent > 100)
            {
                return BadRequest("Discount percentage must be between 0 and 100.");
            }

            try
            {
                // Lấy thông tin giỏ hàng và bao gồm cả dữ liệu của cây (Plant)
                var cartItem = await _context.ShoppingCartItems
                    .Include(c => c.Plant) // Giả sử có thuộc tính điều hướng tới Plant
                    .FirstOrDefaultAsync(c => c.ShoppingCartItemId == cartId);

                if (cartItem == null)
                {
                    return NotFound("Không tìm thấy giỏ hàng.");
                }

                // Tính tổng gốc dựa trên số lượng và giá của cây
                decimal originalTotal = cartItem.Quantity * cartItem.Plant.Price;

                // Tính số tiền giảm giá và tổng giá sau khi áp dụng giảm giá
                decimal discountAmount = originalTotal * (discountPercent / 100);
                decimal discountedTotal = originalTotal - discountAmount;

                // Không lưu discountedTotal vào cơ sở dữ liệu
                // Chỉ trả về các giá trị đã tính toán
                return Ok(new
                {
                    CartId = cartItem.ShoppingCartItemId,
                    OriginalTotal = originalTotal,
                    DiscountPercent = discountPercent,
                    DiscountedTotal = discountedTotal
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi máy chủ nội bộ: " + ex.Message);
            }
        }
    }
}