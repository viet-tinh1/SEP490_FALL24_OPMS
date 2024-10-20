using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DTO
{
    public class ShoppingCartItemDTO
    {
        public int? UserId { get; set; }
        public int ShoppingCartItemId { get; set; }

        public int PlantId { get; set; }

        public int Quantity { get; set; }

     
}
}
