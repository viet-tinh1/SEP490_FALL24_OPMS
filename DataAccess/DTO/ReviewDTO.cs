using System;

namespace DataAccess.DTO
{
    public class ReviewDTO
    {
        public int ReviewId { get; set; }

        public int UserId { get; set; }

        public int PlantId { get; set; }

        public int? Rating { get; set; }

        public string? Comment { get; set; }

        public DateTime? ReviewDate { get; set; }
    }
}
