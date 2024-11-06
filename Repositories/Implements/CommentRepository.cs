using BusinessObject.Models;
using DataAccess.DAO;
using Repositories.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Implements
{
    public class CommentRepository: ICommentRepository
    {
        private readonly CommentDAO _commentDAO = new CommentDAO();
        public void DeleteComment(int id)
        {
            _commentDAO.DeleteComent(id);
        }
        public void CreateComment(Comment comment)
        {
            _commentDAO.CreateComment(comment);
        }
        public List<Comment> GetComments() 
        {
            return _commentDAO.GetComments();
        }
        public void UpdateComment(Comment comment)
        {
            _commentDAO.UpdateComment(comment);
        }
        public List<Comment> GetCommentByPostId(int postId)
        {
            return _commentDAO.GetCommentByPostId(postId);
        }
        public Comment GetCommentById(int commentId)
        {
            return _commentDAO.GetCommentById(commentId);
        }
    }
}
