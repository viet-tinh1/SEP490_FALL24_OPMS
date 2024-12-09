using DataAccess.DAO;
using Repositories.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Implements
{
    public class FollowerRepository : IFollowerRepository 
    {
        private readonly FollowerDAO _followerDao;
        public FollowerRepository(FollowerDAO followerDao)
        {
            _followerDao = followerDao;
        }
        public async Task<string> ToggleFollowerAsync(int userId, int followerId)
        {
            // Kiểm tra nếu userId và followerId trùng nhau
            if (userId == followerId)
                throw new ArgumentException("Một người dùng không thể theo dõi chính mình.");

            // Kiểm tra người dùng tồn tại
            if (!await _followerDao.UserExistsAsync(userId) || !await _followerDao.UserExistsAsync(followerId))
                throw new ArgumentException("Người dùng hoặc người được theo dõi không tồn tại.");

            // Kiểm tra mối quan hệ đã tồn tại
            if (await _followerDao.RelationshipExistsAsync(userId, followerId))
            {
                // Nếu đã tồn tại, xóa mối quan hệ
                await _followerDao.RemoveFollowerAsync(userId, followerId);
                return "Đã hủy mối quan hệ theo dõi.";
            }

            // Nếu chưa tồn tại, thêm mối quan hệ
            await _followerDao.AddFollowerAsync(userId, followerId);
            return "Đã thêm mối quan hệ theo dõi.";
        }
        public async Task<int> CountFollowersAsync(int followerId)
        {
            // Kiểm tra nếu người dùng tồn tại
            if (!await _followerDao.UserExistsAsync(followerId))
                throw new ArgumentException("Người dùng không tồn tại.");

            return await _followerDao.CountFollowersAsync(followerId);
        }
        public async Task<bool> IsFollowingAsync(int userId, int followerId)
        {
            // Kiểm tra nếu người dùng tồn tại
            if (!await _followerDao.UserExistsAsync(userId) || !await _followerDao.UserExistsAsync(followerId))
                throw new ArgumentException("Người dùng hoặc người được theo dõi không tồn tại.");

            return await _followerDao.IsFollowingAsync(userId, followerId);
        }
    }
}
