using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DAO
{
    public class ReplyCommentDAO
    {
        private readonly Db6213Context _context = new Db6213Context();
        public ReplyCommentDAO() { }
        public ReplyCommentDAO(Db6213Context context)
        {
            _context = context;
        }
         public List<ReplyComment> GetReplyComments()
        {
            return _context.ReplyComments.ToList();
        }
        public void DeleteReplyComment(int id)
        {
            var reply = _context.ReplyComments.FirstOrDefault(r => r.ReplyCommentId == id);
            if (reply != null)
            {
                _context.ReplyComments.Remove(reply);
                _context.SaveChanges();
            }
        }
        public void CreateReplyComment(ReplyComment reply)
        {
            _context.ReplyComments.Add(reply);
            _context.SaveChanges();
        }
        public void UpdateReplyComent(ReplyComment reply)
        {
            var existingReply = _context.ReplyComments.FirstOrDefault(r => r.ReplyCommentId == reply.ReplyCommentId);
            if (existingReply != null)
            {
                existingReply.UserId= reply.UserId;
                existingReply.ReplyCommentId= reply.ReplyCommentId;
                existingReply.ReplyCommentId = reply.CommentId;
                existingReply.ReplyCommentContent = reply.ReplyCommentContent;
                existingReply.CreateAt = reply.CreateAt;
                _context.ReplyComments.Update(existingReply);
                _context.SaveChanges();
            }
        }
        public ReplyComment GetReplyCommentById(int id)
        {
            return _context.ReplyComments.FirstOrDefault(r => r.ReplyCommentId == id);
        }
        public List<ReplyComment> GetReplyCommentByCommentId(int commmentId)
        {
            return _context.ReplyComments.Where(r =>r.CommentId == commmentId).ToList();
        }
    }
}
