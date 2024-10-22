using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DAO
{
    public class UserDAO
    {
        // Khởi tạo đối tượng Db6213Context để tương tác với cơ sở dữ liệu.
        readonly Db6213Context _context = new Db6213Context();

        public UserDAO()
        {
        }

        public UserDAO(Db6213Context context)
        {
            _context = context;
        }

        // Phương thức lấy tất cả User từ cơ sở dữ liệu.
        public List<User> GetUsers()
        {
            return _context.Users.ToList(); // Trả về danh sách tất cả Users.
        }

        // Phương thức xóa một User theo ID.
        public void DeleteUser(int id)
        {
            var user = _context.Users.FirstOrDefault(x => x.UserId == id); // Tìm User với ID.
            if (user != null)
            {
                _context.Users.Remove(user); // Xóa User.
                _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
            }
        }

        // Phương thức tạo mới một User.
        public void CreateUser(User user)
        {
            _context.Users.Add(user); // Thêm User vào database.
            _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
        }

        // Phương thức cập nhật một User đã có.
        public void UpdateUser(User u)
        {
            var user = _context.Users.FirstOrDefault(x => x.UserId == u.UserId); // Tìm User theo ID.
            if (user != null)
            {
                user.Username = u.Username;
                user.Password = u.Password;
                user.Email = u.Email;
                user.PhoneNumber = u.PhoneNumber;
                user.Roles = u.Roles;
                user.FullName = u.FullName;
                user.Address = u.Address;
                user.UserImage = u.UserImage;
                user.Status = u.Status;
                user.CreatedDate = u.CreatedDate;

                _context.Users.Update(user); // Cập nhật User trong cơ sở dữ liệu.
                _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
            }
        }

        // Phương thức lấy một User theo ID.
        public User GetUserById(int id)
        {
            return _context.Users.FirstOrDefault(x => x.UserId == id); // Trả về User có ID tương ứng.
        }
        public List<User> GetUserByRole(int roleId)
        {
            return _context.Users
                           .Where(u => u.Roles == roleId) // Only return plants with isVerfied = 1
                           .ToList(); // Trả về User có ID tương ứng.
        }
    }
}