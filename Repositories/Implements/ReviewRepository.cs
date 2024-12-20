﻿using BusinessObject.Models;
using DataAccess.DAO;
using Repositories.Interface;
using System.Collections.Generic;

namespace Repositories.Implements
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly ReviewDAO _reviewDAO = new ReviewDAO();
        // Phương thức xóa một Review theo ID.
        public void DeleteReview(int reviewId)
        {
            _reviewDAO.DeleteReview(reviewId); // Xóa review bằng cách gọi phương thức DAO
        }

        // Phương thức lấy tất cả các Review.
        public List<Review> GetReviews()
        {
            return _reviewDAO.GetReviews(); // Trả về danh sách tất cả các Review từ DAO
        }

        // Phương thức để tạo mới một Review.
        public void CreateReview(Review review)
        {
            _reviewDAO.CreateReview(review); // Tạo một review mới thông qua DAO
        }

        // Phương thức để cập nhật thông tin một Review.
        public void UpdateReview(Review review)
        {
            _reviewDAO.UpdateReview(review); // Cập nhật review thông qua DAO
        }

        // Phương thức để lấy một Review theo ID.
        public Review GetReviewById(int id)
        {
            return _reviewDAO.GetReviewById(id); // Trả về review có ID tương ứng từ DAO
        }

        // Phương thức để lấy các Review theo UserId.
        public List<Review> GetReviewsByUserId(int userId)
        {
            return _reviewDAO.GetReviewsByUserId(userId); // Trả về danh sách review của một người dùng
        }

        // Phương thức để lấy các Review theo PlantId.
        public List<Review> GetReviewsByPlantId(int plantId)
        {
            return _reviewDAO.GetReviewsByPlantId(plantId); // Trả về danh sách review của một cây trồng
        }
    }
}
