using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DTO
{
    public class ReplyCommentDTO
    {
        public int ReplyCommentId { get; set; }

        public int CommentId { get; set; }

        public int UserId { get; set; }

        public string ReplyCommentContent { get; set; } = null!;

        public DateTime? CreateAt { get; set; }
    }
}
