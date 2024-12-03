using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DAO
{
    public class ShoppingCartDAO
    {
        readonly Db6213Context _context = new Db6213Context();

        public ShoppingCartDAO()
        {
        }

        public ShoppingCartDAO(Db6213Context context)
        {
            _context = context;
        }

        // Phương thức lấy tất cả Cart từ cơ sở dữ liệu.
        public List<ShoppingCart> GetCartUser()
        {
            return _context.ShoppingCarts.ToList(); // Trả về danh sách tất cả Carts.
        }

        // Phương thức xóa một Cart theo ID.
        public void DeleteCartUser(int id)
        {
            var cartuser = _context.ShoppingCarts.FirstOrDefault(x => x.ShoppingCartItemId == id); // Tìm Cart với ID.
            if (cartuser != null)
            {
                _context.ShoppingCarts.Remove(cartuser); // Xóa Cart.
                _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
            }
        }

        // Phương thức tạo mới một Cart.
        public void CreateCartUser(ShoppingCart cartuser)
        {
            _context.ShoppingCarts.Add(cartuser); // Thêm Cart vào database.
            _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
        }

        // Phương thức cập nhật một Cart đã có.
        public void UpdateCartUser(ShoppingCart cus)
        {
            var cartuser = _context.ShoppingCarts.FirstOrDefault(x => x.ShoppingCartItemId == cus.ShoppingCartItemId); // Tìm Cart theo ID.
            if (cartuser != null)
            {
                cartuser.ShoppingCartItemId = cus.ShoppingCartItemId;
                cartuser.UserId = cus.UserId;
                

                _context.ShoppingCarts.Update(cartuser); // Cập nhật Cart trong cơ sở dữ liệu.
                _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
            }
        }

        // Phương thức lấy một Cart theo ID.
        public ShoppingCart GetCartUsersById(int id)
        {
            return _context.ShoppingCarts.FirstOrDefault(x => x.ShoppingCartItemId == id); // Trả về Cart có ID tương ứng.
        }
        public ShoppingCart GetCartUsersByUserId(int id)
        {
            return _context.ShoppingCarts.FirstOrDefault(x => x.UserId == id); // Trả về Cart có ID tương ứng.
        }
    }
}
