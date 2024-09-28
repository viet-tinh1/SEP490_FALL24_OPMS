using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DAO
{
    public class PlantDAO
    {
        // Khởi tạo đối tượng Db6213Context để tương tác với cơ sở dữ liệu.
        readonly Db6213Context _context = new Db6213Context();

        public PlantDAO()
        {
        }

        public PlantDAO(Db6213Context context)
        {
            _context = context;
        }

        // Phương thức lấy tất cả Plant từ cơ sở dữ liệu.
        public List<Plant> getPlant()
        {
            return _context.Plants.ToList(); // Trả về danh sách tất cả Plant.
        }

        // Phương thức xóa một Plant theo ID.
        public void deletePlant(int id)
        {
            var p = _context.Plants.FirstOrDefault(x => x.PlantId == id); // Tìm Plant với ID.
            _context.Plants.Remove(p); // Xóa Plant.
            _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
        }

        // Phương thức tạo mới một Plant.
        public void createPlant(Plant p)
        {
            _context.Plants.Add(p); // Thêm Plant vào database.
            _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
        }

        // Phương thức cập nhật một Plant đã có.
        public void updatePlant(Plant p)
        {
            Plant plant = _context.Plants.FirstOrDefault(x => x.PlantId == p.PlantId); // Tìm Plant theo ID.
            plant.PlantName = p.PlantName;
            plant.CategoryId = p.CategoryId;
            plant.Description = p.Description;
            plant.Price = p.Price;
            plant.ImageUrl = p.ImageUrl;
            plant.Stock = p.Stock;
            plant.Status = p.Status;
            _context.Plants.Update(plant); // Cập nhật Plant trong cơ sở dữ liệu.
            _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
        }

        // Phương thức lấy một Plant theo ID.
        public Plant getPlanttById(int id)
        {
            return _context.Plants.FirstOrDefault(x => x.PlantId == id); // Trả về Plant có ID tương ứng.
        }

        // Phương thức tìm kiếm Plant theo tên, category, và giá.

        public List<Plant> searchPlants(string name = null, List<int> categoryId = null, decimal? minPrice = null, decimal? maxPrice = null)

        {
            // Khởi tạo query cơ bản
            var query = _context.Plants.AsQueryable();

            // Điều kiện tìm kiếm theo tên nếu có tham số name
            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(p => p.PlantName.ToLower().Contains(name.ToLower()));
            }

            // Điều kiện tìm kiếm theo category nếu có tham số categoryId

            if (categoryId != null && categoryId.Count > 0)
            {
                query = query.Where(p => categoryId.Contains(p.CategoryId));

            }

            // Điều kiện tìm kiếm theo giá tối thiểu nếu có tham số minPrice
            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }

            // Điều kiện tìm kiếm theo giá tối đa nếu có tham số maxPrice
            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }

            // Trả về danh sách các kết quả phù hợp
            return query.ToList();
        }
    }
}
