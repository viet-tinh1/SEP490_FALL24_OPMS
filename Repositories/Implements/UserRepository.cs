using BusinessObject.Models;
using DataAccess.DAO;
using Repositories.Interface;
using System.Collections.Generic;

namespace Repositories.Implements
{
    public class UserRepository : IUserRepository
    {
        // Khởi tạo đối tượng UserDAO để tương tác với cơ sở dữ liệu qua DAO.
        private UserDAO userDAO = new UserDAO();

        // Phương thức xóa một User theo ID.
        public void DeleteUser(int id)
        {
            userDAO.DeleteUser(id);
        }

        // Phương thức lấy tất cả User.
        public List<User> GetUsers()
        {
            return userDAO.GetUsers(); // Lấy danh sách tất cả User từ DAO.
        }

        // Phương thức để tạo mới một User.
        public void CreateUser(User user)
        {
            userDAO.CreateUser(user);
        }

        // Phương thức để cập nhật thông tin một User.
        public void UpdateUser(User user)
        {
            userDAO.UpdateUser(user);
        }

        // Phương thức để lấy một User theo ID.
        public User GetUserById(int id)
        {
            return userDAO.GetUserById(id); // Trả về User có ID tương ứng.
        }
        public List<User> GetUserByRole(int roleId)
        {
            return userDAO.GetUserByRole(roleId); // Trả về User có ID tương ứng.
        }
        public List<User> GetUserRequest(int request)
        {
            return userDAO.GetUserRequest(request); // Trả về User có ID tương ứng.
        }
    }
}
