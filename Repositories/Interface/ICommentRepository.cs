using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interface
{
    public interface ICommentRepository
    {
        List<Comment> GetComments();
        void DeleteComment(int id);
        void CreateComment(Comment comment);
        void UpdateComment(Comment comment);
        Comment GetCommentById(int commentId);
        List<Comment> GetCommentByPostId(int postId);


    }
}
