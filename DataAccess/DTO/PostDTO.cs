using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DTO
{
    public class PostDTO
    {
        public int PostId { get; set; }

        public int UserId { get; set; }

        public string PostContent { get; set; } = null!;

        public string? PostImage { get; set; }

        public DateTime? Createdate { get; set; }
    }
    public class PostDTOU
    {
        public int PostId { get; set; }

        public int UserId { get; set; }

        public string PostContent { get; set; } = null!;

        public string? PostImage { get; set; }

        public int? LikePost { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
