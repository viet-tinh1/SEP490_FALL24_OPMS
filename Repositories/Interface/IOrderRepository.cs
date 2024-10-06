using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interface
{
    internal interface IOrderRepository
    {
        // phương thức lấy danh sách Order của một người dùng dựa trên UserId
        List<Order> GetOrdersByUserId(int userId);
        // Phương thức lấy tất cả Order.
        List<Order> GetOrders();

        // Phương thức xóa một Order theo ID.
        void DeleteOrder(int id);

        // Phương thức cập nhật thông tin của một Order.
        void UpdateOrder(Order order);

        // Phương thức tạo mới một Order.
        void CreateOrder(Order order);

        // Phương thức lấy một Order theo ID.
        Order GetOrderById(int id);
    }
}
