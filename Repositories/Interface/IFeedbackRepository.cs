using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interface
{
    public interface IFeedbackRepository
    {
        void DeleteFeedback(int id);
        void CreateFeedback(Feedback fed);
        List<Feedback> GetFeedbacks();
        void UpdateFeedback(Feedback fed);
        Feedback GetFeedbackById(int Id);
    }
}
