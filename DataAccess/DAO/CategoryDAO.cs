using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DAO
{
    public class CategoryDAO
    {
        // Phương thức trả về danh sách tất cả Category từ cơ sở dữ liệu.
        public static List<Category> GetCategories()
        {
            // Khởi tạo danh sách rỗng cho Category.
            var listCategories = new List<Category>();
            try
            {
                // Sử dụng DbContext để lấy dữ liệu từ bảng Categories.
                using (var context = new Db6213Context())
                {
                    listCategories = context.Categories.ToList();  // Lấy tất cả Category từ cơ sở dữ liệu và gán vào listCategories.
                }
            }
            // Bắt lỗi nếu có ngoại lệ xảy ra trong quá trình truy xuất dữ liệu.
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
            return listCategories; // Trả về danh sách Category đã lấy được.
        }
    }
}
