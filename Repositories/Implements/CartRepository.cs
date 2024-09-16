using BusinessObject.Models;
using DataAccess.DAO;
using DataAccess.DTO;
using Microsoft.EntityFrameworkCore;
using Repositories.Interface;
using System.Collections.Generic;

namespace Repositories.Implements
{
    public class CartRepository : ICartRepository
    {
        // Khởi tạo đối tượng CartDAO để tương tác với cơ sở dữ liệu qua DAO.
        private CartDAO cartDAO = new CartDAO();
        readonly Db6213Context _context = new Db6213Context();

        // Inject YourDbContext vào constructor của repository
        public CartRepository(Db6213Context context)
        {
            _context = context;
        }

        public CartRepository()
        {
        }

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
        public Cart GetSingleCartById(int id)
        {
            return cartDAO.GetCartById(id); // Trả về Cart có ID tương ứng hoặc null nếu không tìm thấy
        }
        // Phương thức để lấy một Cart theo ID.
        public List<Cart> GetCartById(List<int?> cartIds)
        {
            return _context.Carts.Where(c => cartIds.Contains(c.CartId)).ToList(); // Trả về danh sách các Cart tương ứng
        }
    }
}
