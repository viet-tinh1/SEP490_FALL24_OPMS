using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interface
{
    public interface ICartRepository
    {
        // Phương thức lấy tất cả Carts.
        List<Cart> GetCarts();

        // Phương thức xóa một Cart theo ID.
        void DeleteCart(int id);

        // Phương thức cập nhật thông tin của một Cart.
        void UpdateCart(Cart cart);

        // Phương thức tạo mới một Cart.
        void CreateCart(Cart cart);

        // Phương thức lấy một Cart theo ID.
        User GetCartById(int id);
    }
}

