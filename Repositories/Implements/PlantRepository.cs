using BusinessObject.Models;
using DataAccess.DAO;
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

        
    }
}
