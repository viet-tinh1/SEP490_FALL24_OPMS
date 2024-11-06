using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interface
{
    public interface IReplyCommentRepository
    {
        List<ReplyComment> GetReplyComments();
        void DeleteReplyComment(int id);
        void CreateReplyComment(ReplyComment reply);
        void UpdateReplyComment(ReplyComment reply);
        ReplyComment GetReplyCommentById(int id);
        List<ReplyComment> GetReplyCommentByCommentId(int commmentId);
    }
}
