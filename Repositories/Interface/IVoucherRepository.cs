using BusinessObject.Models;
using System.Collections.Generic;

namespace Repositories.Interface
{
    public interface IVoucherRepository
    {
        // Phương thức lấy tất cả Vouchers.
        List<Voucher> GetVouchers();

        // Phương thức xóa một Voucher theo ID.
        void DeleteVoucher(int id);

        // Phương thức cập nhật thông tin của một Voucher.
        void UpdateVoucher(Voucher voucher);

        // Phương thức tạo mới một Voucher.
        void CreateVoucher(Voucher voucher);

        // Phương thức lấy một Voucher theo tên.
        Voucher GetSingleVoucherByName(string name);
        Voucher GetSingleVoucherById(int id);
    }
}
