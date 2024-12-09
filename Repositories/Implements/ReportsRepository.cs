using BusinessObject.Models;
using DataAccess.DAO;
using Repositories.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Implements
{
    public class ReportsRepository : IReportsRepository
    {
        private readonly ReportDAO _reportDAO = new ReportDAO();
        public void DeleteReport(int id)
        {
            _reportDAO.DeleteReports(id);
        }
        public void CreateReport(Report rp)
        {
            _reportDAO.CreateReports(rp);
        }
        public List<Report> GetReports()
        {
            return _reportDAO.GetReports();
        }
        public void UpdateReport(Report rp)
        {
            _reportDAO.UpdateReport(rp);
        }
        public Report GetReportById(int Id)
        {
            return _reportDAO.GetReportById(Id);
        }
    }
}
