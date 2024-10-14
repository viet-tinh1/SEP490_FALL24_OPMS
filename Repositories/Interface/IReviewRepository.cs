using BusinessObject.Models;
using System.Collections.Generic;

namespace Repositories.Interface
{
    public interface IReviewRepository
    {
        // Phương thức lấy tất cả Reviews.
        List<Review> GetReviews();

        // Phương thức xóa một Review theo ID.
        void DeleteReview(int id);

        // Phương thức cập nhật thông tin của một Review.
        void UpdateReview(Review review);

        // Phương thức tạo mới một Review.
        void CreateReview(Review review);

        // Phương thức lấy một Review theo ID.
        Review GetReviewById(int id);

        // Phương thức lấy danh sách Review theo UserId.
        List<Review> GetReviewsByUserId(int userId);
    }
}
