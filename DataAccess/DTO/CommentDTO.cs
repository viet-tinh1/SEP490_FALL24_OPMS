using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DTO
{
    public class CommentDTO
    {
        public int CommentId { get; set; }

        public int PostId { get; set; }

        public int UserId { get; set; }

        public string CommentsContent { get; set; } = null!;               
    }
    public class ComentDTOU
    {
        public int CommentId { get; set; }

        public int PostId { get; set; }

        public int UserId { get; set; }

        public string CommentsContent { get; set; } = null!;     

        public DateTime? UpdatedAt { get; set; }
    }
}
