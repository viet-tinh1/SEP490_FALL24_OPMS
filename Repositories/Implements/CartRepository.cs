using BusinessObject.Models;
using DataAccess.DAO;
using Repositories.Interface;
using System.Collections.Generic;

namespace Repositories.Implements
{
    public class CartRepository : ICartRepository
    {
        // Khởi tạo đối tượng CartDAO để tương tác với cơ sở dữ liệu qua DAO.
        private CartDAO cartDAO = new CartDAO();

        // Phương thức xóa một Cart theo ID.
        public void DeleteCart(int id)
        {
            cartDAO.DeleteCart(id);
        }

        // Phương thức lấy tất cả Cart.
        public List<Cart> GetCarts()
        {
            return cartDAO.GetCarts(); // Lấy danh sách tất cả Cart từ DAO.
        }

        // Phương thức để tạo mới một Cart.
        public void CreateCart(Cart cart)
        {
            cartDAO.CreateCart(cart);
        }

        // Phương thức để cập nhật thông tin một Cart.
        public void UpdateCart(Cart cart)
        {
            cartDAO.UpdateCart(cart);
        }

        // Phương thức để lấy một Cart theo ID.
        public Cart GetCartById(int id)
        {
            return cartDAO.GetCartById(id); // Trả về Cart có ID tương ứng.
        }

        User ICartRepository.GetCartById(int id)
        {
            throw new NotImplementedException();
        }
    }
}
