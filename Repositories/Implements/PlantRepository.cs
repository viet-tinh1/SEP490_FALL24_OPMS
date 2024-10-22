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
        //hàm để lấy  list plant theo name , price , category 
        public List<Plant> searchPlants(string name = null, List<int> categoryId = null, decimal? minPrice = null, decimal? maxPrice = null)

        {
            // Gọi phương thức searchPlants từ PlantDAO với các tham số có thể là null
            return plantDAO.searchPlants(name, categoryId, minPrice, maxPrice);
        }
        public async Task <List<PlantDTOS>> GetMostPurchasedPlantsFromShoppingCartAsync(int limit)
        {
            return  await plantDAO.GetMostPurchasedPlantsFromShoppingCartAsync(limit);
        }

    }
}
