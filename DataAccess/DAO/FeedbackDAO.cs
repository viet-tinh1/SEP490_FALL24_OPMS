using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DAO
{
    public class FeedbackDAO
    {
        private readonly Db6213Context _context = new Db6213Context();

        public FeedbackDAO() { }

        public FeedbackDAO(Db6213Context context) { _context = context; }

        public List<Feedback> GetFeedbacks()
        {
            return _context.Feedbacks.ToList();
        }
        public void DeleteFeedback(int id)
        {
            var feedback = _context.Feedbacks.FirstOrDefault(fe => fe.FeedbackId == id);
            if (feedback != null)
            {
                _context.Feedbacks.Remove(feedback);
                _context.SaveChanges();
            }
        }
        public void CreateFeedback(Feedback fed)
        {
            _context.Feedbacks.Add(fed);
            _context.SaveChanges();
        }
        public void UpdateFeedback(Feedback fed)
        {
            var existingFeedback = _context.Feedbacks.FirstOrDefault(fe => fe.FeedbackId == fed.FeedbackId);
            if (existingFeedback != null)
            {
                existingFeedback.FeedbackText = fed.FeedbackText;
                existingFeedback.Email = fed.Email;
                existingFeedback.Name = fed.Name;
                existingFeedback.Rating = fed.Rating;
                existingFeedback.CreatedAt = fed.CreatedAt;
                
                _context.Feedbacks.Update(existingFeedback);
                _context.SaveChanges();
            }
        }
        public Feedback GetFeedbackById(int Id)
        {
            return _context.Feedbacks.FirstOrDefault(fe => fe.FeedbackId == Id);
        }
        

    }
}
