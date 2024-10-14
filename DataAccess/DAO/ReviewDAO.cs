using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DataAccess.DAO
{
    public class ReviewDAO
    {
        private readonly Db6213Context _context = new Db6213Context();

        public ReviewDAO()
        {
        }

        public ReviewDAO(Db6213Context context)
        {
            _context = context;
        }

        // Phương thức lấy tất cả các Review từ cơ sở dữ liệu.
        public List<Review> GetReviews()
        {
            return _context.Reviews.ToList(); // Trả về danh sách tất cả các Review.
        }

        // Phương thức xóa một Review theo ID.
        public void DeleteReview(int id)
        {
            var review = _context.Reviews.FirstOrDefault(x => x.ReviewId == id); // Tìm Review theo ID.
            if (review != null)
            {
                _context.Reviews.Remove(review); // Xóa Review.
                _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
            }
        }

        // Phương thức tạo mới một Review.
        public void CreateReview(Review review)
        {
            _context.Reviews.Add(review); // Thêm Review vào cơ sở dữ liệu.
            _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
        }

        // Phương thức cập nhật một Review đã có.
        public void UpdateReview(Review review)
        {
            var existingReview = _context.Reviews.FirstOrDefault(x => x.ReviewId == review.ReviewId); // Tìm Review theo ID.
            if (existingReview != null)
            {
                existingReview.UserId = review.UserId;
                existingReview.PlantId = review.PlantId;
                existingReview.Rating = review.Rating;
                existingReview.Comment = review.Comment;
                existingReview.ReviewDate = review.ReviewDate;

                _context.Reviews.Update(existingReview); // Cập nhật Review trong cơ sở dữ liệu.
                _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
            }
        }

        // Phương thức lấy một Review theo ID.
        public Review GetReviewById(int id)
        {
            return _context.Reviews.FirstOrDefault(x => x.ReviewId == id); // Trả về Review có ID tương ứng.
        }

        // Phương thức lấy các Review theo UserId.
        public List<Review> GetReviewsByUserId(int userId)
        {
            return _context.Reviews.Where(x => x.UserId == userId).ToList(); // Trả về danh sách các Review của User có UserId tương ứng.
        }
    }
}
