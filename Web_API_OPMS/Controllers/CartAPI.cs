using BusinessObject.Models;
using DataAccess.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Repositories.Implements;
using Repositories.Interface;
using System.Data;
using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace Web_API_OPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartAPI : ControllerBase
    {
        private PlantRepository PlantRepository = new PlantRepository();
        private CartRepository CartRepository = new CartRepository();
        private CartUserRepository CartUserRepository = new CartUserRepository();
        private readonly Db6213Context _context;

        public CartAPI(Db6213Context context)
        {
            _context = context;
        }

        //Lấy danh sách Cart
        [HttpGet("getCart")]
        public ActionResult<IEnumerable<Cart>> getCart()
        {
            return CartRepository.GetCarts();
        }
        [HttpGet("getCartByUser")]
        public ActionResult<IEnumerable<CartUser>> GetCartByUser()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)  // If the user is not logged in or session expired
            {
                return Unauthorized("User is not logged in.");
            }
            // Lấy danh sách các CartId từ bảng CartUser theo UserId
            var cartUsers = CartUserRepository.GetCartUsersByUserId(userId.Value);

            if (cartUsers == null || !cartUsers.Any())  // Kiểm tra danh sách có rỗng hay không
            {
                return NotFound("No carts found for the given user.");
            }

            // Lấy danh sách các CartId từ CartUser
            var cartIds = cartUsers.Select(cu => cu.CartId).ToList(); // Chọn CartId từ CartUser

            // Lấy danh sách các Cart từ bảng Cart dựa trên các CartId
            var carts = CartRepository.GetCartById(cartIds);

            return Ok(carts);


        }
        //Tạo 1 Cart  mới
        [HttpPost("createCart")]
        public IActionResult CreateCartAsync([FromBody] CartDTO c)
        {
            //using session userId from login api 
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)// If the user is not logged in or session expired
            {
                return Unauthorized(new { message = "User not logged in" });
            }
            if (c == null)
            {
                return BadRequest("Invalid Cart data");
            }

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

                //// Deduct the quantity from the plant's stock
                //plant.Stock -= c.Quantity;
                //PlantRepository.updatePlant(plant); // Update the plant stock in the database


                Cart cart = new Cart()
                {
                    CartId = c.CartId,
                    PlantId = c.PlantId,
                    Quantity = c.Quantity
                };
                CartRepository.CreateCart(cart);
             
                CartUser cartUser = new CartUser()
                {
                    CartId = cart.CartId,
                    UserId = userId // Gán giá trị UserId from session
                };
                CartUserRepository.CreateCartUser(cartUser);
                return CreatedAtAction(nameof(GetCartById), new { id = cart.CartId }, cart);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        // Chỉnh sửa Cart đã tạo
        [HttpPost("updateCart")]
        public IActionResult UpdateCart([FromBody] CartDTO c)
        {
            if (c == null)
            {
                return BadRequest("Invalid Cart data");
            }

            try
            {

                var existingCart = CartRepository.GetSingleCartById(c.CartId);
                if (existingCart == null)
                {
                    return NotFound($"Cart not found");
                }

                // Update the existing cart properties
               
                existingCart.CartId = c.CartId;
                existingCart.PlantId = c.PlantId;
                existingCart.Quantity = c.Quantity;

                // Save changes
                CartRepository.UpdateCart(existingCart);

                return NoContent(); // 204 No Content on successful update
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        //Xóa 1 Cart 
        [HttpGet("deleteCart")]
        public IActionResult DeleteCart(int CartId)
        {
            try
            {
                // Xóa tất cả các bản ghi trong bảng CartUser liên quan đến CartId
                CartUserRepository.DeleteCartUser(CartId);

                // Xóa cart khỏi bảng Cart
                CartRepository.DeleteCart(CartId);

                return NoContent(); // Trả về phản hồi không có nội dung
            }
            catch (Exception ex)
            {
                // Xử lý lỗi nếu có vấn đề trong quá trình xóa
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        [HttpGet("getCartById")]
        public ActionResult<Cart> GetCartById(int id)
        {
            var cart = CartRepository.GetSingleCartById(id);

            if (cart == null)
            {
                return NotFound(); // Return 404 if the cart isn't found
            }

            return Ok(cart); // Return 200 with the cart data
        }

    }
}
