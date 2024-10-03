using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DTO
{
    public class PlantDTO
    {
        public int PlantId { get; set; }       
        public string PlantName { get; set; } = null!;
        public int CategoryId { get; set; }
        public string Description { get; set; } = null!;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = null!;
        public int? Stock { get; set; }
        public int? Status { get; set; }
        public int? IsVerfied { get; set; }

        public decimal? Discount { get; set; }


    }
    public class PlantDTOU
    {
        public int PlantId { get; set; }
        public int UserId { get; set; }
        public string PlantName { get; set; } = null!;
        public int CategoryId { get; set; }
        public string Description { get; set; } = null!;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = null!;
        public int? Stock { get; set; }
        public int? Status { get; set; }
        public decimal? Discount { get; set; }
    }
}
