using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DTO
{
    public  class OrderDTO
    {
        public int OrderId { get; set; }

        public List<int> ShoppingCartItemIds { get; set; } // Danh sách CartId
        public DateTime OrderDate { get; set; }       
    }
    public class OrderDTOU
    {
        public int OrderId { get; set; }

        public int ShoppingCartItemId { get; set; }
        public DateTime OrderDate { get; set; }

        public decimal TotalAmount { get; set; }

        public string? Status { get; set; }
        public int UserId { get; set; }
    }
}
