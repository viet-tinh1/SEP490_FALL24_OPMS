using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DAO
{
    public class CartUserDAO
    {
        readonly Db6213Context _context = new Db6213Context();

        public CartUserDAO()
        {
        }

        public CartUserDAO(Db6213Context context)
        {
            _context = context;
        }

        // Phương thức lấy tất cả Cart từ cơ sở dữ liệu.
        public List<CartUser> GetCartUser()
        {
            return _context.CartUsers.ToList(); // Trả về danh sách tất cả Carts.
        }

        // Phương thức xóa một Cart theo ID.
        public void DeleteCartUser(int id)
        {
            var cartuser = _context.CartUsers.FirstOrDefault(x => x.CartId == id); // Tìm Cart với ID.
            if (cartuser != null)
            {
                _context.CartUsers.Remove(cartuser); // Xóa Cart.
                _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
            }
        }

        // Phương thức tạo mới một Cart.
        public void CreateCartUser(CartUser cartuser)
        {
            _context.CartUsers.Add(cartuser); // Thêm Cart vào database.
            _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
        }

        // Phương thức cập nhật một Cart đã có.
        public void UpdateCartUser(CartUser cus)
        {
            var cartuser = _context.CartUsers.FirstOrDefault(x => x.CartId == cus.CartId); // Tìm Cart theo ID.
            if (cartuser != null)
            {
                cartuser.CartId = cus.CartId;
                cartuser.UserId = cus.UserId;
                

                _context.CartUsers.Update(cartuser); // Cập nhật Cart trong cơ sở dữ liệu.
                _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
            }
        }

        // Phương thức lấy một Cart theo ID.
        public CartUser GetCartUsersById(int id)
        {
            return _context.CartUsers.FirstOrDefault(x => x.CartId == id); // Trả về Cart có ID tương ứng.
        }
        public CartUser GetCartUsersByUserId(int id)
        {
            return _context.CartUsers.FirstOrDefault(x => x.UserId == id); // Trả về Cart có ID tương ứng.
        }
    }
}
