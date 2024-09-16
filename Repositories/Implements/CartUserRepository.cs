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
    public class CartUserRepository: ICartUserRepository
    {
        // Khởi tạo đối tượng CartUserDAO để tương tác với cơ sở dữ liệu qua DAO.
        private CartUserDAO cartuserDAO = new CartUserDAO();
        readonly Db6213Context _context = new Db6213Context();

        // Inject YourDbContext vào constructor của repository
        public CartUserRepository(Db6213Context context)
        {
            _context = context;
        }

        public CartUserRepository()
        {
        }

        // Phương thức xóa một Cart theo ID.
        public void DeleteCartUser(int id)
        {
            cartuserDAO.DeleteCartUser(id);
        }

        // Phương thức lấy tất cả Cart.
        public List<CartUser> GetCartUsers()
        {
            return cartuserDAO.GetCartUser(); // Lấy danh sách tất cả Cart từ DAO.
        }

        // Phương thức để tạo mới một Cart.
        public void CreateCartUser(CartUser cartUser)
        {
            cartuserDAO.CreateCartUser(cartUser);
        }

        // Phương thức để cập nhật thông tin một Cart.
        public void UpdateCartUser(CartUser cartUser)
        {
            cartuserDAO.UpdateCartUser(cartUser);
        }

        // Phương thức để lấy một Cart theo ID.
        public CartUser GetCartUserById(int id)
        {
            return cartuserDAO.GetCartUsersById(id); // Trả về CartUser có ID tương ứng.
        }
        // Phương thức để lấy một Cartuser theo UserID.
        public List<CartUser> GetCartUsersByUserId(int userId)
        {
            return _context.CartUsers.Where(cu => cu.UserId == userId).ToList();
        }

    }
}
