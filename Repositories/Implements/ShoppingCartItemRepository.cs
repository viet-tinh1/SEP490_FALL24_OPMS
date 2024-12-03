using BusinessObject.Models;
using DataAccess.DAO;
using DataAccess.DTO;
using Microsoft.EntityFrameworkCore;
using Repositories.Interface;
using System.Collections.Generic;

namespace Repositories.Implements
{
    public class ShoppingCartItemRepository : IShoppingCartItemRepository
    {
        // Khởi tạo đối tượng CartDAO để tương tác với cơ sở dữ liệu qua DAO.
        private ShoppingCartItemDAO cartDAO = new ShoppingCartItemDAO();
        readonly Db6213Context _context = new Db6213Context();

        // Inject YourDbContext vào constructor của repository
        public ShoppingCartItemRepository(Db6213Context context)
        {
            _context = context;
        }

        public ShoppingCartItemRepository()
        {
        }

        // Phương thức xóa một Cart theo ID.
        public void DeleteCart(int cartId)
        {
            // Tìm một đối tượng Cart duy nhất trong bảng Carts với CartId khớp với cartId được truyền vào
            var cart = _context.ShoppingCartItems.SingleOrDefault(c => c.ShoppingCartItemId == cartId);

            // Ktra  nếu tìm thấy cart (cart khác null)
            if (cart != null)
            {
                // Nếu tìm thấy cart, thực hiện xóa cart đó khỏi bảng Carts
                _context.ShoppingCartItems.Remove(cart);

                // Lưu các thay đổi vào cơ sở dữ liệu sau khi xóa
                _context.SaveChanges();
            }
        }

        // Phương thức lấy tất cả Cart.
        public List<ShoppingCartItem> GetCarts()
        {
            return cartDAO.GetCarts(); // Lấy danh sách tất cả Cart từ DAO.
        }

        // Phương thức để tạo mới một Cart.
        public void CreateCart(ShoppingCartItem cart)
        {
            cartDAO.CreateCart(cart);
        }

        // Phương thức để cập nhật thông tin một Cart.
        public void UpdateCart(ShoppingCartItem cart)
        {
            cartDAO.UpdateCart(cart);
        }
        public ShoppingCartItem GetSingleCartById(int id)
        {
            return cartDAO.GetCartById(id); // Trả về Cart có ID tương ứng hoặc null nếu không tìm thấy
        }
        public ShoppingCartItem GetCartItemByUserAndPlantId(int userId, int plantId)
        {
            return cartDAO.GetCartItemByUserAndPlantId(userId, plantId);
        }
        // Phương thức để lấy một Cart theo ID.
        public List<ShoppingCartItem> GetCartById(List<int?> cartIds)
        {
            return _context.ShoppingCartItems.Where(c => cartIds.Contains(c.ShoppingCartItemId)).ToList(); // Trả về danh sách các Cart tương ứng
        }
    }
}
