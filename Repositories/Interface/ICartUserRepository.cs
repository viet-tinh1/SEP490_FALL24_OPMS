using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interface
{
    public interface ICartUserRepository
    {
        // Phương thức lấy tất cả Carts.
        List<CartUser> GetCartUsers();

        // Phương thức xóa một Cart theo ID.
        void DeleteCartUser(int id);

        // Phương thức cập nhật thông tin của một Cart.
        void UpdateCartUser(CartUser cartuser);

        // Phương thức tạo mới một Cart.
        void CreateCartUser(CartUser cartuser);

        // Phương thức lấy một Cart theo ID.
        CartUser GetCartUserById(int id);
        List<CartUser> GetCartUsersByUserId(int userId);
    }
}
