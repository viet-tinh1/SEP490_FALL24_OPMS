using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DAO
{
    public class OrderDAO
    {
        // Khởi tạo đối tượng Db6213Context để tương tác với cơ sở dữ liệu.
        readonly Db6213Context _context = new Db6213Context();

        public OrderDAO()
        {
        }

        public OrderDAO(Db6213Context context)
        {
            _context = context;
        }

        //  lấy tất cả Order từ cơ sở dữ liệu.
        public List<Order> GetOrders()
        {
            return _context.Orders.ToList(); // Trả về danh sách tất cả Order.
        }
        //  lấy danh sách đơn hàng theo UserId
        public List<Order> GetOrdersByUserId(int userId)
        {
            return _context.Orders
                           .Where(o => o.UserId == userId) // Lọc theo UserId
                           .ToList(); // Trả về danh sách đơn hàng
        }
        // Phương thức xóa một Order  theo ID.
        public void DeleteOrder(int id)
        {
            var order = _context.Orders.FirstOrDefault(x => x.OrderId == id); // Tìm Order với ID.
            if (order != null)
            {
                _context.Orders.Remove(order); // Xóa Order.
                _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
            }
        }

        // Phương thức tạo mới một Order.
        public void CreateOrder(Order order)
        {
            _context.Orders.Add(order); // Thêm Order vào database.
            _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
        }



        // Phương thức cập nhật một Order đã có.
        public void UpdateOrder(Order o)
        {
            var order = _context.Orders.FirstOrDefault(x => x.OrderId == o.OrderId); // Tìm Order theo ID.
            if (order != null)
            {
                order.ShoppingCartItemId = o.ShoppingCartItemId;
                order.OrderDate = o.OrderDate;
                order.TotalAmount = o.TotalAmount;
                order.Status = o.Status;


                _context.Orders.Update(order); // Cập nhật Order trong cơ sở dữ liệu.
                _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
            }
        }

        // Phương thức lấy một Order theo ID.
        public Order GetOrderById(int id)
        {
            return _context.Orders.FirstOrDefault(x => x.OrderId == id); // Trả về Order có ID tương ứng.
        }
        // Phương thức tạo nhiều đơn hàng từ danh sách cartId
        public void CreateOrdersFromCartIds(List<int> cartIds, int userId)
        {
            foreach (var cartId in cartIds)
            {
                var shoppingCartItem = _context.ShoppingCartItems.FirstOrDefault(s => s.ShoppingCartItemId == cartId); // Tìm item trong giỏ hàng
                if (shoppingCartItem != null)
                {
                    var order = new Order
                    {
                        ShoppingCartItemId = cartId,
                        UserId = userId,
                        OrderDate = DateTime.Now,
                        TotalAmount = 0, // Tính toán tổng số tiền sau
                        Status = "Pending"
                    };

                    _context.Orders.Add(order);
                }

                _context.SaveChanges();
            }
        }
    }
}