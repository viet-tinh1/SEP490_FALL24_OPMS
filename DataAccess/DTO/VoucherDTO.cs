using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DTO
{
    public class VoucherDTO
    {
        public int VoucherId { get; set; }

        public string? VoucherName { get; set; }

        public decimal? VoucherPercent { get; set; }

        public DateTime? CreateDate { get; set; }

        public DateTime? CloseDate { get; set; }

        public bool? Status { get; set; }

        public DateTime? OpenDate { get; set; }

        public decimal? Amount { get; set; }
    }
}
