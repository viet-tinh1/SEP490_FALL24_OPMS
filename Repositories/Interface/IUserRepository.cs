using BusinessObject.Models;
using System.Collections.Generic;

namespace Repositories.Interface
{
    public interface IUserRepository
    {
        // Phương thức lấy tất cả Users.
        List<User> GetUsers();

        // Phương thức xóa một User theo ID.
        void DeleteUser(int id);

        // Phương thức cập nhật thông tin của một User.
        void UpdateUser(User user);

        // Phương thức tạo mới một User.
        void CreateUser(User user);

        // Phương thức lấy một User theo ID.
        User GetUserById(int id);
    }
}
