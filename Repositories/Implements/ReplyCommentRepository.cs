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
    public class ReplyCommentRepository : IReplyCommentRepository
    {
        private readonly ReplyCommentDAO _replyDAO = new ReplyCommentDAO();

        public void DeleteReplyComment(int id)
        {
            _replyDAO.DeleteReplyComment(id);
        }
        public List<ReplyComment> GetReplyComments() 
        { 
            return _replyDAO.GetReplyComments();
        }
        public void CreateReplyComment(ReplyComment reply)
        {
            _replyDAO.CreateReplyComment(reply);
        }
        public void UpdateReplyComment(ReplyComment reply)
        {
            _replyDAO.UpdateReplyComent(reply);
        }
        public ReplyComment GetReplyCommentById(int id) 
        {
            return _replyDAO.GetReplyCommentById(id);
        }
        public List<ReplyComment> GetReplyCommentByCommentId(int commentId)
        {
            return _replyDAO.GetReplyCommentByCommentId(commentId);
        }      
    }
}
