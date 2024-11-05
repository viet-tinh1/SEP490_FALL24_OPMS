using BusinessObject.Models;
using DataAccess.DAO;
using DataAccess.DTO;
using Repositories.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Implements
{
    public class PostRepository :IPostRepository
    {
        private readonly PostDAO _postDAO = new PostDAO();

        public void DeletePost(int postId)
        {
            _postDAO.DeletePost(postId);
        }
        public List<Post> GetPosts()
        {
            return _postDAO.GetPost();
        }
        public void CreatePost(Post post)
        {
            _postDAO.CreatePost(post);
        }
        public void UpdatePost(Post post)
        {
            _postDAO.UpdatePost(post);
        }
        public Post GetPostById(int postId)
        {
            return _postDAO.GetPostById(postId);
        }
        public List<Post>GetPostByUserId(int userId)
        {
            return _postDAO.GetPostByUserId(userId);
        }
    }
}
