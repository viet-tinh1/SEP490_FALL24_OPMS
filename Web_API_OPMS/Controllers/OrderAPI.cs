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
        private PlantRepository PlantRepository = new PlantRepository();
        private CartRepository CartRepository = new CartRepository();
        private OrderRepository OrderRepository = new OrderRepository();
        private CartUserRepository CartUserRepository = new CartUserRepository();
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
        public IActionResult CreateOrderAsync([FromBody] OrderDTO o)
        {
            // Kiểm tra nếu dữ liệu order (o) là null, trả về lỗi BadRequest
            if (o == null)
            {
                return BadRequest("Invalid order data");
            }
            // Sử dụng transaction để đảm bảo nếu một trong các bước thất bại, tất cả các thay đổi sẽ bị hủy bỏ
            using (var transaction = _context.Database.BeginTransaction())
            {

                try
                {
                    // Lấy thông tin chi tiết của cart dựa trên CartId
                    var cart = CartRepository.GetSingleCartById(o.CartId);
                    // Kiểm tra nếu cart không tồn tại, trả về lỗi NotFound
                    if (cart == null)
                    {
                        return NotFound("Cart not found.");
                    }

                    // Lấy thông tin chi tiết của plant dựa trên PlantId có trong cart
                    var plant = PlantRepository.getPlantById(cart.PlantId);
                    if (plant == null)
                    {
                        return NotFound("Plant not found.");
                    }

                    // Tính toán tổng số tiền cho đơn hàng (giá của plant * số lượng trong cart)
                    var totalAmount = plant.Price * cart.Quantity;

                    // Tạo một đối tượng order với trạng thái là "1" (đơn hàng thành công)
                    Order order = new Order()
                    {
                        CartId = o.CartId,               // Gán CartId từ dữ liệu đầu vào
                        OrderDate = o.OrderDate,         // Ngày tạo order
                        TotalAmount = totalAmount,       // Tổng số tiền được tính toán tự động
                        Status = "1",                    // Đặt trạng thái đơn hàng là "1" (thành công)
                        UserId = o.UserId                // Gán UserId từ dữ liệu đầu vào
                    };

                    // Lưu đơn hàng mới vào repository
                    OrderRepository.CreateOrder(order);

                    // Thực hiện xóa CartUser
                    try
                    {
                        CartUserRepository.DeleteCartUser(o.CartId);
                    }
                    catch (Exception ex)
                    {
                        return BadRequest($"Error deleting CartUser: {ex.Message}");
                    }

                    // Commit transaction sau khi tất cả các bước trên thành công
                    transaction.Commit();

                    // Trả về phản hồi với mã 201 (Created) và thông tin đơn hàng vừa tạo
                    return CreatedAtAction(nameof(GetOrderById), new { id = order.OrderId }, order);
                }
                catch (Exception ex)
                {
                    // Nếu có lỗi xảy ra, rollback transaction để hủy bỏ tất cả thay đổi đã thực hiện
                    transaction.Rollback();

                    return StatusCode(500, "Internal server error: " + ex.Message);
                }
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
