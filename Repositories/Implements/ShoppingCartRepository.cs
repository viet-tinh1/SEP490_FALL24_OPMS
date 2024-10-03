using BusinessObject.Models;
using DataAccess.DAO;
using Microsoft.EntityFrameworkCore;
using Repositories.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Implements
{
    public class ShoppingCartRepository: IShoppingCartRepository
    {
        // Khởi tạo đối tượng CartUserDAO để tương tác với cơ sở dữ liệu qua DAO.
        private ShoppingCartDAO shoppingCartDAO = new ShoppingCartDAO();
        readonly Db6213Context _context = new Db6213Context();

        // Inject YourDbContext vào constructor của repository
        public ShoppingCartRepository(Db6213Context context)
        {
            _context = context;
        }

        public ShoppingCartRepository()
        {
        }

        // Phương thức xóa một Cart theo ID.
        public void DeleteCartUser(int cartId)
        {
            // Lấy danh sách các liên kết giữa Cart và User từ bảng CartUser
            var shoppingCart = _context.ShoppingCarts.Where(cu => cu.ShoppingCartItemId == cartId).ToList();

            // Kiểm tra xem có tồn tại bất kỳ liên kết nào không
            if (shoppingCart == null || !shoppingCart.Any())
            {
                throw new Exception($"CartId {cartId} không tồn tại trong bảng CartUser.");
            }
                // Nếu tìm thấy các bản ghi CartUser, xóa toàn bộ các bản ghi đó khỏi bảng CartUser
                _context.ShoppingCarts.RemoveRange(shoppingCart);

                // Lưu các thay đổi vào csdl sau khi xóa
                _context.SaveChanges();
            }
        // Phương thức lấy tất cả Cart.
        public List<ShoppingCart> GetCartUsers()
        {
            return shoppingCartDAO.GetCartUser(); // Lấy danh sách tất cả Cart từ DAO.
        }

        // Phương thức để tạo mới một Cart.
        public void CreateCartUser(ShoppingCart shoppingCart)
        {
            shoppingCartDAO.CreateCartUser(shoppingCart);
        }

        // Phương thức để cập nhật thông tin một Cart.
        public void UpdateCartUser(ShoppingCart shoppingCart)
        {
            shoppingCartDAO.UpdateCartUser(shoppingCart);
        }

        // Phương thức để lấy một Cart theo ID.
        public ShoppingCart GetCartUserById(int id)
        {
            return shoppingCartDAO.GetCartUsersById(id); // Trả về CartUser có ID tương ứng.
        }
        // Phương thức để lấy một Cartuser theo UserID.
        public List<ShoppingCart> GetCartUsersByUserId(int userId)
        {
            return _context.ShoppingCarts.Where(cu => cu.UserId == userId).ToList();
        }

    }
}
