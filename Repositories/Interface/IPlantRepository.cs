using BusinessObject.Models;
using DataAccess.DTO;
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
        List<Plant> getVerifiedPlants();
        List<Plant> getNonVerifiedPlants();
        // Xóa một Plant dựa trên ID.
        void deletePlant(int id);
        // Cập nhật thông tin của một Plant.
        void updatePlant(Plant p);
        // Tạo mới một Plant.
        void createPlant(Plant p);   
        // Lấy một Plant dựa trên ID.
        Plant getPlantById(int id);
        List<Plant> getPlantByUser(int UserId);
        List<Plant> getPlantByUserIsVerify(int UserId);
        // Lấy list  Plant dựa trên name , category, price    
        List<Plant> searchPlants(string name = null, List<int> categoryId = null, decimal? minPrice = null, decimal? maxPrice = null, int? sortOption = null);
        List<Plant> SearchPlantsByShop(int userId, string name = null, List<int> categoryId = null, decimal? minPrice = null, decimal? maxPrice = null, int? sortOption = null);
        Task<List<PlantDTOS>> GetMostPurchasedPlantsFromShoppingCartAsync(int limit);
        Task<List<PlantDTOS>> GetMostPurchasedPlantsByShopFromShoppingCartAsync(int limit, int userId);
    }
}
