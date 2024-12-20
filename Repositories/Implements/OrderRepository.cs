﻿using BusinessObject.Models;
using DataAccess.DAO;
using Repositories.Interface;
using System.Collections.Generic;

namespace Repositories.Implements
{
    public class OrderRepository : IOrderRepository
    {
        // Khởi tạo đối tượng OrderDAO để tương tác với cơ sở dữ liệu qua DAO.
        private OrderDAO orderDAO = new OrderDAO();

        // Phương thức xóa một Order theo ID.
        public void DeleteOrder(int id)
        {
            orderDAO.DeleteOrder(id);
        }

        // Phương thức lấy tất cả Order.
        public List<Order> GetOrders()
        {
            return orderDAO.GetOrders(); // Lấy danh sách tất cả Order từ DAO.
        }

        // Phương thức để tạo mới một Order.
        public void CreateOrder(Order order)
        {
            orderDAO.CreateOrder(order);
        }

        // Phương thức để cập nhật thông tin một Order.
        public void UpdateOrder(Order order)
        {
            orderDAO.UpdateOrder(order);
        }

        // Phương thức để lấy một Order theo ID.
        public Order GetOrderById(int id)
        {
            return orderDAO.GetOrderById(id); // Trả về Order có ID tương ứng.
        }
        //  lấy đơn hàng theo UserId
        public List<Order> GetOrdersByUserId(int userId)
        {

            return orderDAO.GetOrdersByUserId(userId); // Gọi DAO để lấy danh sách đơn hàng
        }

        // Phương thức  cap nhat trang thai don hang

        public void UpdateOrderStatus(int orderId, string status)
        {
            // Lấy thông tin đơn hàng hiện có từ DAO.
            var order = orderDAO.GetOrderById(orderId);
            if(order != null)
            {
                order.Status = status;  // Cập nhật cột trạng thái của đơn hàng.
                orderDAO.UpdateOrder(order);  // Lưu thay đổi trạng thái vào cơ sở dữ liệu.
            }

        }

    }
}
