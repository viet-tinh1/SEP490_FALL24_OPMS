using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interface
{
    public interface IPlantRepository
    {
        // Trả về danh sách tất cả Plant.
        List<Plant> getPlant();
        // Xóa một Plant dựa trên ID.
        void deletePlant(int id);
        // Cập nhật thông tin của một Plant.
        void updatePlant(Plant p);
        // Tạo mới một Plant.
        void createPlant(Plant p);   
        // Lấy một Plant dựa trên ID.
        Plant getPlantById(int id);
        // List<Plant> getProductsByPriceAndName(string searchName);
        // List<ReportSale> getStaticReportSale(DateTime startDate, DateTime endDate);
    }
}
