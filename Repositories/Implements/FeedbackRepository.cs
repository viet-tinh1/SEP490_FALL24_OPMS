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
    public class FeedbackRepository : IFeedbackRepository
    {
        private readonly FeedbackDAO _feedbackDAO = new FeedbackDAO();
        public void DeleteFeedback(int id)
        {
            _feedbackDAO.DeleteFeedback(id);
        }
        public void CreateFeedback(Feedback fed)
        {
            _feedbackDAO.CreateFeedback(fed);
        }
        public List<Feedback> GetFeedbacks()
        {
            return _feedbackDAO.GetFeedbacks();
        }
        public void UpdateFeedback(Feedback fed)
        {
            _feedbackDAO.UpdateFeedback(fed);
        }
        public Feedback GetFeedbackById(int Id)
        {
            return _feedbackDAO.GetFeedbackById(Id);
        }
        
    }
}
