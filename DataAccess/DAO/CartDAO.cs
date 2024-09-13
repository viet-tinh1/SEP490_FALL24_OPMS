using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DAO
{
    public class CartDAO
    {
        // Khởi tạo đối tượng Db6213Context để tương tác với cơ sở dữ liệu.
        readonly Db6213Context _context = new Db6213Context();

        public CartDAO()
        {
        }

        public CartDAO(Db6213Context context)
        {
            _context = context;
        }

        // Phương thức lấy tất cả Cart từ cơ sở dữ liệu.
        public List<Cart> GetCarts()
        {
            return _context.Carts.ToList(); // Trả về danh sách tất cả Carts.
        }

        // Phương thức xóa một Cart theo ID.
        public void DeleteCart(int id)
        {
            var cart = _context.Carts.FirstOrDefault(x => x.CartId == id); // Tìm Cart với ID.
            if (cart != null)
            {
                _context.Carts.Remove(cart); // Xóa Cart.
                _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
            }
        }

        // Phương thức tạo mới một Cart.
        public void CreateCart(Cart cart)
        {
            _context.Carts.Add(cart); // Thêm Cart vào database.
            _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
        }

        // Phương thức cập nhật một Cart đã có.
        public void UpdateCart(Cart c)
        {
            var cart = _context.Carts.FirstOrDefault(x => x.CartId == c.CartId); // Tìm Cart theo ID.
            if (cart != null)
            {
                cart.CartId = c.CartId;
                cart.PlantId = c.PlantId;
                cart.Quantity = c.Quantity;

        _context.Carts.Update(cart); // Cập nhật Cart trong cơ sở dữ liệu.
                _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
            }
        }

        // Phương thức lấy một Cart theo ID.
        public Cart GetCartById(int id)
        {
            return _context.Carts.FirstOrDefault(x => x.CartId == id); // Trả về Cart có ID tương ứng.
        }
    }
}