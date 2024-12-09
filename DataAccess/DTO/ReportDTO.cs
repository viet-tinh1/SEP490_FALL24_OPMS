using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DTO
{
    public class ReportDTO
    {
        public int ReportId { get; set; }

        public int UserId { get; set; }

        public int PlantId { get; set; }

        public int ReasonsId { get; set; }

        public string? ReportContent { get; set; }

        public DateTime? CreatedDate { get; set; }
    }
}
