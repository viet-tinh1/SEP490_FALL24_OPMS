using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DAO
{
    public class ReasonDAO
    {
        public static List<Reason> GetResons()
        {
            // Khởi tạo danh sách rỗng cho Category.
            var listReasons = new List<Reason>();
            try
            {
                // Sử dụng DbContext để lấy dữ liệu từ bảng Categories.
                using (var context = new Db6213Context())
                {
                    listReasons = context.Reasons.ToList();  // Lấy tất cả Category từ cơ sở dữ liệu và gán vào listCategories.
                }
            }
            // Bắt lỗi nếu có ngoại lệ xảy ra trong quá trình truy xuất dữ liệu.
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
            return listReasons; // Trả về danh sách Category đã lấy được.
        }
    }
}
