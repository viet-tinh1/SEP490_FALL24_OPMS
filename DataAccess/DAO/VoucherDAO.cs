using BusinessObject.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DataAccess.DAO
{
    public class VoucherDAO
    {
        readonly Db6213Context _context = new Db6213Context();

        public VoucherDAO()
        {
        }

        public VoucherDAO(Db6213Context context)
        {
            _context = context;
        }

        // Phương thức lấy tất cả Voucher từ cơ sở dữ liệu.
        public List<Voucher> GetVouchers()
        {
            return _context.Vouchers.ToList(); // Trả về danh sách tất cả Voucher.
        }

        // Phương thức xóa một Voucher theo ID.
        public void DeleteVoucher(int id)
        {
            var voucher = _context.Vouchers.FirstOrDefault(x => x.VoucherId == id); // Tìm Voucher với ID.
            if (voucher != null)
            {
                _context.Vouchers.Remove(voucher); // Xóa Voucher.
                _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
            }
        }

        // Phương thức tạo mới một Voucher.
        public void CreateVoucher(Voucher voucher)
        {
            _context.Vouchers.Add(voucher); // Thêm Voucher vào database.
            _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
        }

        // Phương thức cập nhật một Voucher đã có.
        public void UpdateVoucher(Voucher voucher)
        {
            var vc = _context.Vouchers.FirstOrDefault(x => x.VoucherId == voucher.VoucherId); // Tìm Voucher theo ID.
            if (vc != null)
            {
                vc.VoucherName = voucher.VoucherName;
                vc.VoucherPercent = voucher.VoucherPercent;
                vc.CreateDate = voucher.CreateDate;
                vc.CloseDate = voucher.CloseDate;
                vc.Status = voucher.Status;
                vc.OpenDate = voucher.OpenDate;
                vc.Amount = voucher.Amount;
                vc.UserId = voucher.UserId;

                _context.Vouchers.Update(vc); // Cập nhật Voucher trong cơ sở dữ liệu.
                _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
            }
        }

        //// Phương thức lấy một Voucher theo ID.
        public Voucher GetVoucherById(int id)
        {
            return _context.Vouchers.FirstOrDefault(x => x.VoucherId == id); // Trả về Voucher có ID tương ứng.
        }

        // Phương thức lấy một Voucher theo tên.
        public Voucher GetVoucherByName(string name)
        {
            return _context.Vouchers.FirstOrDefault(x => x.VoucherName == name); // Trả về Voucher có tên tương ứng.
        }

    }
}
