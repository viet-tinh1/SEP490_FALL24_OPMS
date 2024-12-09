using BusinessObject.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DAO
{
    public class FollowerDAO
    {
        private readonly Db6213Context _context = new Db6213Context();

        public FollowerDAO() { }

        public FollowerDAO(Db6213Context context)
        {
            _context = context;
        }
        public async Task<bool> UserExistsAsync(int userId)
        {
            return await _context.Users.AnyAsync(u => u.UserId == userId);
        }

        public async Task<bool> RelationshipExistsAsync(int userId, int followerId)
        {
            return await _context.Users
                .Where(u => u.UserId == followerId)
                .SelectMany(u => u.Users)
                .AnyAsync(f => f.UserId == userId);
        }

        public async Task AddFollowerAsync(int userId, int followerId)
        {
            var userToFollow = await _context.Users
                .Include(u => u.Users)
                .FirstOrDefaultAsync(u => u.UserId == followerId);

            var userFollower = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);

            if (userToFollow == null || userFollower == null)
                throw new ArgumentException("Người dùng hoặc người được theo dõi không tồn tại.");

            userToFollow.Users.Add(userFollower);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveFollowerAsync(int userId, int followerId)
        {
            var userToFollow = await _context.Users
                .Include(u => u.Users)
                .FirstOrDefaultAsync(u => u.UserId == followerId);

            var userFollower = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);

            if (userToFollow == null || userFollower == null)
                throw new ArgumentException("Người dùng hoặc người được theo dõi không tồn tại.");

            userToFollow.Users.Remove(userFollower);
            await _context.SaveChangesAsync();
        }
        public async Task<int> CountFollowersAsync(int followerId)
        {
            return await _context.Users
                .Where(u => u.UserId == followerId)
                .SelectMany(u => u.Users) // Danh sách người theo dõi của followerId
                .CountAsync();
        }
        public async Task<bool> IsFollowingAsync(int userId, int followerId)
        {
            return await _context.Users
                .Where(u => u.UserId == followerId) // Tìm người được theo dõi
                .SelectMany(u => u.Users) // Lấy danh sách người theo dõi
                .AnyAsync(f => f.UserId == userId); // Kiểm tra xem UserId có trong danh sách không
        }
    }
}
