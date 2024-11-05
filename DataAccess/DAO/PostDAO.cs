using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DAO
{
    public  class PostDAO
    {
        private readonly Db6213Context _context = new Db6213Context();

        public PostDAO() { }

        public PostDAO(Db6213Context context) {  _context = context; }

        public List<Post> GetPost()
        {
            return _context.Posts.ToList();
        }
        public void DeletePost(int postId)
        {
            var post = _context.Posts.FirstOrDefault(po => po.PostId == postId);
            if (post != null)
            {
                _context.Posts.Remove(post);
                _context.SaveChanges();
            }
        }
        public void CreatePost(Post post)
        {
            _context.Posts.Add(post); // Thêm Review vào cơ sở dữ liệu.
            _context.SaveChanges();
        }
        public void UpdatePost(Post post)
        {
            var existingPost = _context.Posts.FirstOrDefault(po => po.PostId == post.PostId); // Tìm Review theo ID.
            if (existingPost != null)
            {
                existingPost.UserId = post.UserId;
                existingPost.PostId = post.PostId;
                existingPost.PostContent = post.PostContent;
                existingPost.UpdatedAt = post.UpdatedAt;
                existingPost.Createdate = post.Createdate;
                existingPost.LikePost = post.LikePost;
                existingPost.PostImage = post.PostImage;
                _context.Posts.Update(existingPost); // Cập nhật Review trong cơ sở dữ liệu.
                _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
            }
        }
        public Post GetPostById(int postId)
        {
            return _context.Posts.FirstOrDefault(po => po.PostId == postId); // Trả về Review có ID tương ứng.
        }

        public List<Post> GetPostByUserId(int userId)
        {
            return _context.Posts.Where(po => po.UserId == userId).ToList(); // Trả về danh sách các Review của User có UserId tương ứng.
        }
    }
}
