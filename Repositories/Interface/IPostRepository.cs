using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interface
{
    public interface IPostRepository
    {
        List<Post> GetPosts();
        void DeletePost(int postId);
        void CreatePost(Post post);
        void UpdatePost(Post post);
        Post GetPostById(int postId);
        List<Post> GetPostByUserId(int userId);
    }
}
