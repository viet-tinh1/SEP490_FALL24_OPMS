using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DTO
{
    public class FeebbackDTO
    {
        public int FeedbackId { get; set; }

        public string Name { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string FeedbackText { get; set; } = null!;

        public string? Rating { get; set; }

        public DateTime? CreatedAt { get; set; }
    }
}
