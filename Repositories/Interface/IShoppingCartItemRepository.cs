using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interface
{
    public interface IShoppingCartItemRepository
    {
        // Phương thức lấy tất cả Carts.
        List<ShoppingCartItem> GetCarts();

        // Phương thức xóa một Cart theo ID.
        void DeleteCart(int id);

        // Phương thức cập nhật thông tin của một Cart.
        void UpdateCart(ShoppingCartItem cart);

        // Phương thức tạo mới một Cart.
        void CreateCart(ShoppingCartItem cart);
        ShoppingCartItem GetSingleCartById(int id);
        ShoppingCartItem GetCartItemByUserAndPlantId(int userId, int plantId);
        // Phương thức lấy một Cart theo ID.       
        List<ShoppingCartItem> GetCartById(List<int?> cartIds);
    }
}

