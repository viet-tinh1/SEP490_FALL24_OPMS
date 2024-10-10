using BusinessObject.Models;
using DataAccess.DTO;
using Microsoft.AspNetCore.Mvc;
using Repositories.Implements;
using Repositories.Interface;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Web_API_OPMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VoucherAPI : ControllerBase
    {
        private readonly IVoucherRepository VoucherRepository;

        public VoucherAPI(IVoucherRepository voucherRepository)
        {
            VoucherRepository = voucherRepository;
        }

        // Lấy danh sách Voucher
        [HttpGet("getVouchers")]
        public ActionResult<IEnumerable<Voucher>> GetVouchers()
        {
            var vouchers = VoucherRepository.GetVouchers();
            // Kiểm tra nếu danh sách vouchers rỗng
            if (vouchers == null || !vouchers.Any())
            {
                return NotFound(new { message = "Không có voucher nào được tìm thấy." });
            }

            return Ok(vouchers);
        }

        // Lấy Voucher theo Id
        [HttpGet("getVoucherById")]
        public ActionResult<Voucher> GetVoucherById(int id)
        {
            var voucher = VoucherRepository.GetSingleVoucherById(id);

            if (voucher == null)
            {
                return NotFound(new { message = "Voucher not found" });
            }

            return Ok(voucher);
        }
        // Lấy Voucher theo tên
        [HttpGet("getVoucherByName")]
        public ActionResult<Voucher> GetVoucherByName(string name)
        {
            var voucher = VoucherRepository.GetSingleVoucherByName(name);

            if (voucher == null)
            {
                return NotFound(new { message = "Voucher not found" });
            }

            return Ok(voucher);
        }

        // Tạo 1 Voucher mới
        [HttpPost("createVoucher")]
        public IActionResult CreateVoucher([FromBody] VoucherDTO voucherDTO)
        {
            if (voucherDTO == null)
            {
                return BadRequest("Invalid voucher data");
            }

            try
            {
                Voucher voucher = new Voucher()
                {
                    VoucherId = voucherDTO.VoucherId,
                    VoucherName = voucherDTO.VoucherName,
                    VoucherPercent = voucherDTO.VoucherPercent,
                    CreateDate = voucherDTO.CreateDate,
                    CloseDate = voucherDTO.CloseDate,
                    Status = voucherDTO.Status,
                    OpenDate = voucherDTO.OpenDate,
                    Amount = voucherDTO.Amount
                };

                VoucherRepository.CreateVoucher(voucher);

                return CreatedAtAction(nameof(GetVoucherByName), new { name = voucher.VoucherName }, voucher);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        // Chỉnh sửa Voucher đã tạo
        [HttpPost("updateVoucher")]
        public IActionResult UpdateVoucher([FromBody] VoucherDTO voucherDTO)
        {
            if (voucherDTO == null)
            {
                return BadRequest("Invalid voucher data");
            }

            try
            {
                var existingVoucher = VoucherRepository.GetSingleVoucherById(voucherDTO.VoucherId);
                if (existingVoucher == null)
                {
                    return NotFound($"Voucher with name {voucherDTO.VoucherName} not found.");
                }

                // Cập nhật các thuộc tính của voucher
                existingVoucher.VoucherName = voucherDTO.VoucherName;
                existingVoucher.VoucherPercent = voucherDTO.VoucherPercent;
                existingVoucher.CreateDate = voucherDTO.CreateDate ?? DateTime.Now;
                existingVoucher.CloseDate = voucherDTO.CloseDate;
                existingVoucher.Status = voucherDTO.Status ?? true;
                existingVoucher.OpenDate = voucherDTO.OpenDate ?? DateTime.Now;
                existingVoucher.Amount = voucherDTO.Amount ?? 0;

                // Tự động xóa nếu Amount bằng 0
                if (existingVoucher.Amount == 0)
                {
                    VoucherRepository.DeleteVoucher(existingVoucher.VoucherId);
                    return Ok(new { message = "Voucher deleted automatically as the amount reached 0." });
                }

                VoucherRepository.UpdateVoucher(existingVoucher);

                return Ok(new { message = "Voucher updated successfully", updatedVoucher = existingVoucher });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Xóa Voucher
        [HttpDelete("deleteVoucher")]
        public IActionResult DeleteVoucher(int id)
        {
            try
            {
                // Tìm voucher theo ID
                var voucher = VoucherRepository.GetSingleVoucherById(id); // Sửa đổi để lấy theo tên nếu cần
                if (voucher == null)
                {
                    return NotFound($"Voucher with ID {id} not found.");
                }             
                // Xóa voucher khỏi cơ sở dữ liệu
                VoucherRepository.DeleteVoucher(id);

                return Ok(new { message = "Voucher deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
