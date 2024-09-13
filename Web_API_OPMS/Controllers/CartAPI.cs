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
        private CartRepository CartRepository = new CartRepository();
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
        //Tạo 1 Cart  mới
        [HttpPost("createCart")]
        public IActionResult CreateCartAsync([FromBody] CartDTO c)
        {
            if (c == null)
            {
                return BadRequest("Invalid Cart data");
            }

            try
            {

                Cart cart = new Cart()
                {
                    CartId = c.CartId,
                    PlantId = c.PlantId,
                    Quantity = c.Quantity
                };
                CartRepository.CreateCart(cart);
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

                var existingCart = CartRepository.GetCartById(c.CartId);
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
        public IActionResult deleteCart(int CartId)
        {
            CartRepository.DeleteCart(CartId);
            return NoContent();
        }
        [HttpGet("getCartById")]
        public ActionResult<Cart> GetCartById(int id)
        {
            var cart = CartRepository.GetCartById(id);

            if (cart == null)
            {
                return NotFound(); // Return 404 if the cart isn't found
            }

            return Ok(cart); // Return 200 with the cart data
        }

    }
}
