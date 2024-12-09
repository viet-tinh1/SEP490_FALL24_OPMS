using BusinessObject.Models;
using DataAccess.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Repositories.Implements;
using Repositories.Interface;

namespace Web_API_OPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsAPI : ControllerBase
    {
        private readonly IReportsRepository _reportsRepository;
        public ReportsAPI(IReportsRepository reportsRepository)
        {
            _reportsRepository = reportsRepository;
        }
        [HttpGet("getReport")]
        public ActionResult<IEnumerable<Report>> GetReport()
        {
            var report = _reportsRepository.GetReports();
            if (report == null)
            {
                return NotFound(new { message = "Không có tố cáo nào được tìm thấy." });
            }
            return Ok(report);
        }
        [HttpGet("getReportById")]
        public ActionResult<Feedback> GetReportById(int Id)
        {
            var report = _reportsRepository.GetReportById(Id);
            if (report == null)
            {
                return NotFound(new { message = "Không tồn tại tố cáo." });
            }
            return Ok(report);
        }
        [HttpPost("createReport")]
        public async Task<IActionResult> CreateReportAsync([FromBody] ReportDTO reportDTO)
        {
            if (reportDTO == null)
            {
                return BadRequest("Invalid comment data");
            }

            try
            {
                // Lấy giờ hiện tại theo giờ Việt Nam (GMT+7)
                TimeZoneInfo vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
                DateTime utcNow = DateTime.UtcNow;
                DateTime currentVietnamTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, vietnamTimeZone);

                Report report = new Report()
                {
                    UserId = reportDTO.UserId,
                    PlantId = reportDTO.PlantId,
                    ReasonsId = reportDTO.ReasonsId,
                    ReportContent = reportDTO.ReportContent,
                    CreatedDate = currentVietnamTime,
                };


                _reportsRepository.CreateReport(report);

                return CreatedAtAction(nameof(GetReportById), new { id = report.ReportId }, report);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}
