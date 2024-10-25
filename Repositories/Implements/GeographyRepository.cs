using Repositories.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Implements
{
    public  class GeographyRepository : IGeographyRepository
    {
        private readonly string _data;
        public GeographyRepository()
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "data.json");
            if (System.IO.File.Exists(filePath))
            {
                _data = System.IO.File.ReadAllText(filePath); // Load dữ liệu ngay khi khởi tạo dịch vụ
            }
            else
            {
                _data = null;
            }
        }

        public string GetGeographyData()
        {
            return _data;
        }
    }
}
