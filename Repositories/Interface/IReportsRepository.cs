using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interface
{
    public interface IReportsRepository
    {
        void DeleteReport(int id);
        void CreateReport(Report rp);
        void UpdateReport(Report rp);
        List<Report> GetReports();
        Report GetReportById(int Id);
    }
}
