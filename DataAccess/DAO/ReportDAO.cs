using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DAO
{
    public class ReportDAO
    {
        private readonly Db6213Context _context = new Db6213Context();
        public ReportDAO() { }
        public ReportDAO (Db6213Context context)
        {
            _context = context;
        }
        public List<Report> GetReports()
        {
            return _context.Reports.ToList();
        }
        public void CreateReports(Report rp)
        {
            _context.Reports.Add(rp);
            _context.SaveChanges();
        }
        public Report GetReportById(int Id)
        {
            return _context.Reports.FirstOrDefault(rp => rp.ReportId == Id);
        }
        public void UpdateReport(Report rp)
        {
            var existingReports = _context.Reports.FirstOrDefault(rp => rp.ReportId == rp.ReportId);
            if (existingReports != null)
            {
                existingReports.UserId = rp.UserId;
                existingReports.PlantId = rp.PlantId;
                existingReports.ReasonsId = rp.ReasonsId;
                existingReports.ReportContent = rp.ReportContent;
                existingReports.CreatedDate = rp.CreatedDate;

                _context.Reports.Update(existingReports);
                _context.SaveChanges();
            }
        }
        public void DeleteReports(int id)
        {
            var report = _context.Reports.FirstOrDefault(rp => rp.ReportId == id);
            if (report != null)
            {
                _context.Reports.Remove(report);
                _context.SaveChanges();
            }
        }
    }
}
