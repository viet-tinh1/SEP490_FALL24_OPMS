using BusinessObject.Models;
using DataAccess.DAO;
using DataAccess.DTO;
using Repositories.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Implements
{
    public class PlantRepository : IPlantRepository
    {
        // tạo 1 đối tượng plant mới từ PlantDAO
        private PlantDAO plantDAO = new PlantDAO();
        //hàm để xóa 1 plant
        public void deletePlant(int id)
        {
            plantDAO.deletePlant(id);
        }
        //hàm để lấy tất cả  plant
        public List<Plant> getPlant()
        {
            return plantDAO.getPlant();

        }
        //hàm để lấy tất cả  plant đã Verified
        public List<Plant> getVerifiedPlants()
        {
            return plantDAO.getVerifiedPlants();

        }
        //hàm để lấy tất cả  plant chưa Verified
        public List<Plant> getNonVerifiedPlants()
        {
            return plantDAO.getNonVerifiedPlants();

        }
        //hàm để tạo 1 plant
        public void createPlant(Plant p)
        {
            plantDAO.createPlant(p);
        }
        //hàm để câp nhật  1 plant
        public void updatePlant(Plant p)
        {
            plantDAO.updatePlant(p);
        }
        //hàm để lấy  1 plant theo id
        public Plant getPlantById(int id)
        {
            return plantDAO.getPlanttById(id);
        }
        public List<Plant> getPlantByUser(int UserId)
        {
            return plantDAO.getPlantByUser(UserId);

        }
        public List<Plant> getPlantByUserIsVerify(int UserId)
        {
            return plantDAO.getPlantByUserIsVerify(UserId);

        }
        //hàm để lấy  list plant theo name , price , category 
        public List<PlantDTOS> searchPlants(int? limit = null, string name = null, List<int> categoryId = null, decimal? minPrice = null, decimal? maxPrice = null, int? sortOption = null)

        {
            // Gọi phương thức searchPlants từ PlantDAO với các tham số có thể là null
            return plantDAO.searchPlants(limit,name, categoryId, minPrice, maxPrice, sortOption);
        }
        public List<PlantDTOS> SearchPlantsByShop(int userId, string name = null, List<int> categoryId = null, decimal? minPrice = null, decimal? maxPrice = null, int? sortOption = null, int? limit = null)
        {
            // Gọi phương thức searchPlants từ PlantDAO với các tham số có thể là null
            return plantDAO.SearchPlantsByShop(userId, name, categoryId, minPrice, maxPrice, sortOption,limit);
        }
        public async Task <List<PlantDTOS>> GetMostPurchasedPlantsFromShoppingCartAsync(int limit)
        {
            return  await plantDAO.GetMostPurchasedPlantsFromShoppingCartAsync(limit);
        }
        public Task<List<PlantDTOS>> GetMostPurchasedPlantsByShopFromShoppingCartAsync(int limit, int userId)
        {
            throw new NotImplementedException();
        }
        //public async Task<List<PlantDTOS>> GetMostPurchasedPlantsByShopFromShoppingCartAsync(int limit, int userId)
        //{
        //    return await plantDAO.GetMostPurchasedPlantsByShopFromShoppingCartAsync(limit, userId);
        //}


    }
}
