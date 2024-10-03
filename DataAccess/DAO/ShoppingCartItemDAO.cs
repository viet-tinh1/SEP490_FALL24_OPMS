using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DAO
{
    public class ShoppingCartItemDAO
    {
        // Khởi tạo đối tượng Db6213Context để tương tác với cơ sở dữ liệu.
        readonly Db6213Context _context = new Db6213Context();

        public ShoppingCartItemDAO()
        {
        }

        public ShoppingCartItemDAO(Db6213Context context)
        {
            _context = context;
        }

        // Phương thức lấy tất cả Cart từ cơ sở dữ liệu.
        public List<ShoppingCartItem> GetCarts()
        {
            return _context.ShoppingCartItems.ToList(); // Trả về danh sách tất cả Carts.
        }

        // Phương thức xóa một Cart theo ID.
        public void DeleteCart(int id)
        {
            var cart = _context.ShoppingCartItems.FirstOrDefault(x => x.ShoppingCartItemId == id); // Tìm Cart với ID.
            if (cart != null)
            {
                _context.ShoppingCartItems.Remove(cart); // Xóa Cart.
                _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
            }
        }

        // Phương thức tạo mới một Cart.
        public void CreateCart(ShoppingCartItem cart)
        {
            _context.ShoppingCartItems.Add(cart); // Thêm Cart vào database.
            _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
        }

        // Phương thức cập nhật một Cart đã có.
        public void UpdateCart(ShoppingCartItem c)
        {
            var cart = _context.ShoppingCartItems.FirstOrDefault(x => x.ShoppingCartItemId == c.ShoppingCartItemId); // Tìm Cart theo ID.
            if (cart != null)
            {
                cart.ShoppingCartItemId = c.ShoppingCartItemId;
                cart.PlantId = c.PlantId;
                cart.Quantity = c.Quantity;

        _context.ShoppingCartItems.Update(cart); // Cập nhật Cart trong cơ sở dữ liệu.
                _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
            }
        }

        // Phương thức lấy một Cart theo ID.
        public ShoppingCartItem GetCartById(int id)
        {
            return _context.ShoppingCartItems.FirstOrDefault(x => x.ShoppingCartItemId == id); // Trả về Cart có ID tương ứng.
        }
    }
}