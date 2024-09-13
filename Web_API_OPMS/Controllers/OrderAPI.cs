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
    public class OrderAPI : ControllerBase
    {
        private OrderRepository OrderRepository = new OrderRepository();
        private readonly Db6213Context _context;

        public OrderAPI(Db6213Context context)
        {
            _context = context;
        }

        //Lấy danh sách Order
        [HttpGet("getOrder")]
        public ActionResult<IEnumerable<Order>> getOrder()
        {
            return OrderRepository.GetOrders();
        }
        //Tạo 1 order  mới
        [HttpPost("createOrder")]
        public  IActionResult CreateOrderAsync([FromBody] OrderDTO o)
        {
            if (o == null )
            {
                return BadRequest("Invalid order data");
            }
            
            try
            {
               
                Order order = new Order()
                {
                    CartId = o.CartId,
                    OrderDate = o.OrderDate,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status,
                };
                OrderRepository.CreateOrder(order);
                return CreatedAtAction(nameof(GetOrderById), new { id = order.OrderId }, order);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        // Chỉnh sửa Order đã tạo
        [HttpPost("updateOrder")]
        public IActionResult UpdateOrder([FromBody] OrderDTO o)
        {
            if (o == null)
            {
                return BadRequest("Invalid User data");
            }

            try
            {
         
                var existingOrder = OrderRepository.GetOrderById(o.OrderId);
                if (existingOrder == null)
                {
                    return NotFound($"Order not found");
                }

                // Update the existing order properties
                existingOrder.CartId = o.CartId;
                existingOrder.OrderDate = DateTime.Now;
                existingOrder.TotalAmount = o.TotalAmount;
                existingOrder.Status = o.Status;
               

                // Save changes
                OrderRepository.UpdateOrder(existingOrder);

                return NoContent(); // 204 No Content on successful update
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
        //Xóa 1 Order 
        [HttpGet("deleteOrder")]
        public IActionResult deleteOrder(int OrderId)
        {
            OrderRepository.DeleteOrder(OrderId);
            return NoContent();
        }
        [HttpGet("getOrderById")]
        public ActionResult<Order> GetOrderById(int id)
        {
            var order = OrderRepository.GetOrderById(id);

            if (order == null)
            {
                return NotFound(); // Return 404 if the order isn't found
            }

            return Ok(order); // Return 200 with the order data
        }

    }
}
