using BusinessObject.Models;
using DataAccess.DAO;
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
using System.Linq;

namespace Web_API_OPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderAPI : ControllerBase
    {
        private PlantRepository PlantRepository = new PlantRepository();
        private ShoppingCartItemRepository ShoppingCartItemRepository = new ShoppingCartItemRepository();
        private OrderRepository OrderRepository = new OrderRepository();
        private ShoppingCartRepository ShoppingCartRepository = new ShoppingCartRepository();
        private readonly Db6213Context _context;

        public OrderAPI(Db6213Context context)
        {
            _context = context;
        }

        //Lấy danh sách Order
        [HttpGet("getOrder")]
        public ActionResult<IEnumerable<Order>> getOrder()
        {
            return OrderRepository.GetOrders();// Lấy tất cả đơn hàng từ repository.
        }

        //Tạo 1 order  mới
        [HttpPost("createOrder")]
        public IActionResult CreateOrderAsync([FromBody] OrderDTO orderDTO)
        {
            // Kiểm tra nếu orderDTO là null hoặc không có CartId nào
            if (orderDTO == null || orderDTO.ShoppingCartItemIds == null || !orderDTO.ShoppingCartItemIds.Any())
            {
                return BadRequest("Invalid order data");
            }
            // Sử dụng transaction để đảm bảo nếu một trong các bước thất bại, tất cả các thay đổi sẽ bị hủy bỏ
            using (var transaction = _context.Database.BeginTransaction())
            {

                try
                {
                    var orderList = new List<Order>();

                    foreach (var cartId in orderDTO.ShoppingCartItemIds)
                    {
                        // Lấy thông tin chi tiết của cart dựa trên CartId
                        var cart = ShoppingCartItemRepository.GetSingleCartById(cartId);
                        // Kiểm tra nếu cart không tồn tại, trả về lỗi NotFound
                        if (cart == null)
                        {
                            return NotFound("Cart not found.");
                        }

                        // Lấy thông tin chi tiết của plant dựa trên PlantId có trong cart

                        var plant = PlantRepository.getPlantById(cart.PlantId);  // Lấy chi tiết plant.

                        if (plant == null)
                        {
                            return NotFound("Plant not found.");
                        }
                        // Lấy giờ hiện tại theo giờ Việt Nam (GMT+7)
                        TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
                        DateTime utcNow = DateTime.UtcNow;
                        DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);
                        // Tính toán tổng số tiền cho đơn hàng (giá của plant * số lượng trong cart)
                        var totalAmount = plant.Price * cart.Quantity;
                        int randomOrderId;
                        do
                        {
                            randomOrderId = new Random().Next(100000, 999999); // Tạo số ngẫu nhiên 6 chữ số
                        } while (_context.Orders.Any(o => o.OrderId == randomOrderId)); // Kiểm tra xem ID đã tồn tại chưa
                        // Tạo một đối tượng order với trạng thái là "1" (đơn hàng thành công)
                        Order order = new Order()
                        {
                            OrderId = randomOrderId,
                            ShoppingCartItemId = cartId,  // Gán CartId từ dữ liệu đầu vào
                            OrderDate = currentVietnamTime, // Ngày tạo order
                            TotalAmount = orderDTO.TotalAmount,       // Tổng số tiền được tính toán tự động
                            Status = "Pending",              // Đặt trạng thái đơn hàng là "1" (thành công)
                            UserId = orderDTO.UserId,            // Gán UserId từ session
                            ShippingAddress  = orderDTO.ShippingAddress,
                            PaymentMethod = orderDTO.PaymentMethod,
                            IsSuccess = 0
                        }; 

                        // Lưu đơn hàng mới vào repository
                        OrderRepository.CreateOrder(order);
                        orderList.Add(order);

                        // Thực hiện xóa CartUser
                        try
                        {
                            ShoppingCartRepository.DeleteCartUser(cartId);
                        }
                        catch (Exception ex)
                        {
                            return BadRequest($"Error deleting CartUser: {ex.Message}");
                        }
                        // Giảm số lượng hàng trong kho
                        plant.Stock -= cart.Quantity;
                        // cập nhật lại trạng thái khi hết hàng 
                        if (plant.Stock <= 0)
                        {
                            plant.Stock = 0;                          
                        }
                        PlantRepository.updatePlant(plant);
                    }
                    // Commit transaction sau khi tất cả các bước trên thành công
                    transaction.Commit();

                    return Ok(new {message ="", orders = orderList }); // Trả về phản hồi thành công
                }
                catch (Exception ex)
                {
                    // Nếu có lỗi xảy ra, rollback transaction để hủy bỏ tất cả thay đổi đã thực hiện
                    transaction.Rollback();

                    return StatusCode(500, "Internal server error: " + ex.Message);
                }
            }
        }
        // API cập nhật trạng thái đơn hàng chỉ cho seller.
        [HttpPost("updateOrderStatus")]
        public IActionResult UpdateOrderStatus([FromBody] UpdateOrderStatusDTO updateOrderStatusDTO)
        {       
            try
            {
                // Lấy thông tin đơn hàng từ Repository
                var order = OrderRepository.GetOrderById(updateOrderStatusDTO.OrderId);
                if (order == null)
                {
                    return NotFound(new { message = "Order not found." });
                }
                if (order.IsSuccess == 1 && updateOrderStatusDTO.Status.ToLower() == "cancel")
                {
                    return BadRequest(new { message = "Cannot cancel a successful order." });
                }
                // Cập nhật trạng thái đơn hàng.
                OrderRepository.UpdateOrderStatus(updateOrderStatusDTO.OrderId, updateOrderStatusDTO.Status);

                return NoContent();  // Trả về 204 No Content nếu cập nhật thành công.
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);  // Trả về lỗi 500 nếu có lỗi xảy ra.
            }
        }

        // Chỉnh sửa Order đã tạo
        [HttpPost("updateOrder")]
        public IActionResult UpdateOrder([FromBody] OrderDTOU o)
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
                existingOrder.ShoppingCartItemId = o.ShoppingCartItemId;
                existingOrder.OrderDate = DateTime.Now;
                existingOrder.TotalAmount = o.TotalAmount;
                existingOrder.Status = o.Status;
                existingOrder.ShippingAddress = o.ShippingAddress;
                existingOrder.PaymentMethod = o.PaymentMethod;
                existingOrder.IsSuccess = o.IsSuccess;


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
            OrderRepository.DeleteOrder(OrderId);  // Xóa đơn hàng.
            return NoContent();  // Trả về 204 No Content nếu thành công.
        }
        // API lấy đơn hàng theo ID.

        [HttpGet("getOrderById")]
        public ActionResult<Order> GetOrderById(int id)
        {
            var order = _context.Orders
                         .Include(o => o.ShoppingCartItem)
                         .ThenInclude(s => s.Plant)
                         .FirstOrDefault(o => o.OrderId == id);

            if (order == null)
            {
                return NotFound();
            }

            return Ok(order); // Return 200 with the order data
        }
        [HttpGet("getOrderByIds")]
        public ActionResult<Order> GetOrderByIds(int id)
        {
            var order = OrderRepository.GetOrderById(id);




            return Ok(order); // Return 200 with the order data
        }
        // Lấy danh sách Order theo UserId
        [HttpGet("getOrdersByUserId")]
        public ActionResult<IEnumerable<Order>> GetOrdersByUserId(int userId)
        {
            
                
            // Lấy danh sách đơn hàng theo UserId
            var orders = OrderRepository.GetOrdersByUserId(userId);

            // Kiểm tra nếu không có đơn hàng nào được tìm thấy, trả về mã lỗi 404 Not Found
            if (orders == null || !orders.Any())
            {
                return NotFound(new { message = "No orders found for this user." });
            }

            // Nếu tìm thấy đơn hàng, trả về danh sách đơn hàng
            return Ok(orders);
        }
        [HttpGet("getOrdersBySeller")]
        public IActionResult GetOrdersBySeller([FromQuery] int sellerId)
        {
            try
            {
                // Step 1: Retrieve all plant IDs associated with the seller
                var sellerPlantIds = _context.Plants
                    .Where(p => p.UserId == sellerId)
                    .Select(p => p.PlantId)
                    .ToList();

                // If the seller has no plants, return an empty result
                if (sellerPlantIds.Count == 0)
                {
                    return Ok(new { message = "No orders found for this seller's products.", orders = new List<object>() });
                }

                // Step 2: Retrieve orders that contain any of the seller's plants in their shopping cart items
                var orders = _context.Orders
                    .Where(order => sellerPlantIds.Contains(order.ShoppingCartItem.PlantId))
                    .Select(order => new
                {
                order.OrderId,
                order.OrderDate,
                order.TotalAmount,
                order.Status,
                order.IsSuccess,
                order.PaymentMethod,
                order.ShippingAddress,
                ShoppingCartItems = new
                {
                    order.ShoppingCartItem.PlantId,
                    PlantName = order.ShoppingCartItem.Plant.PlantName,
                    order.ShoppingCartItem.Quantity
                }
            })
            .ToList();

                return Ok(new { message = "Orders found for the seller's products.", orders });
            }
            catch (Exception ex)
            {
                // Log the exception (if logging is set up) and return a 500 error with details
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }


    }
}
