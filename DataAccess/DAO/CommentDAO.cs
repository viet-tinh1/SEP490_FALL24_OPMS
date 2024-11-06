using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DAO
{
    public class CommentDAO
    {
        private readonly Db6213Context  _context = new Db6213Context();

        public CommentDAO() { }

         public CommentDAO(Db6213Context context) {  _context = context; }

        public List<Comment> GetComments()
        {
           return _context.Comments.ToList();
        }
        public void DeleteComent(int id)
        {
            var comment = _context.Comments.FirstOrDefault(cm => cm.CommentId == id);
            if (comment != null)
            {
                _context.Comments.Remove(comment);
                _context.SaveChanges();
            }
        }
        public void CreateComment(Comment comment)
        {
            _context.Comments.Add(comment);
            _context.SaveChanges();
        }
        public void UpdateComment(Comment comment)
        {
            var existingComment = _context.Comments.FirstOrDefault(cm => cm.CommentId == comment.CommentId);
            if (existingComment != null)
            {
                existingComment.UserId = comment.UserId;
                existingComment.CommentId = comment.CommentId;
                existingComment.CommentTime= comment.CommentTime;
                existingComment.CommentsContent = comment.CommentsContent;
                existingComment.UpdatedAt = comment.UpdatedAt;
                existingComment.PostId = comment.PostId;
                existingComment.LikeComment = comment.LikeComment;
                _context.Comments.Update(existingComment);
                _context.SaveChanges();
            }
        }
        public Comment GetCommentById(int commentId)
        {
            return _context.Comments.FirstOrDefault(cm => cm.CommentId == commentId);
        }
        public List<Comment>GetCommentByPostId(int postId)
        {
            return _context.Comments.Where(cm => cm.PostId == postId).ToList();
        }

    }
}
