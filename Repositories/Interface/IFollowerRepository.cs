using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interface
{
    public interface IFollowerRepository
    {
        Task<string> ToggleFollowerAsync(int userId, int followerId);
        Task<int> CountFollowersAsync(int followerId);
        Task<bool> IsFollowingAsync(int userId, int followerId);
    }
}
