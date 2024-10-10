using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DTO
{
    public  class UpdateOrderStatusDTO
    {
        public int OrderId { get; set; }

        public string Status { get; set; } // Trạng thái mới của đơn hàng ( Pending, Completed)
    }
}
