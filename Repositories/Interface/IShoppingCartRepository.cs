using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interface
{
    public interface IShoppingCartRepository
    {
        // Phương thức lấy tất cả Carts.
        List<ShoppingCart> GetCartUsers();

        // Phương thức xóa một Cart theo ID.
        void DeleteCartUser(int id);

        // Phương thức cập nhật thông tin của một Cart.
        void UpdateCartUser(ShoppingCart shoppingCart);

        // Phương thức tạo mới một Cart.
        void CreateCartUser(ShoppingCart shoppingCart);

        // Phương thức lấy một Cart theo ID.
        ShoppingCart GetCartUserById(int id);
        List<ShoppingCart> GetCartUsersByUserId(int userId);
    }
}
