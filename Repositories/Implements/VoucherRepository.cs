using BusinessObject.Models;
using DataAccess.DAO;
using Repositories.Interface;
using System.Collections.Generic;

namespace Repositories.Implements
{
    public class VoucherRepository : IVoucherRepository
    {
        private VoucherDAO voucherDAO = new VoucherDAO();
        readonly Db6213Context _context = new Db6213Context();

        public VoucherRepository(Db6213Context context)
        {
            _context = context;
        }

        public VoucherRepository()
        {
        }

        // Phương thức xóa một Voucher theo ID.
        public void DeleteVoucher(int voucherId)
        {
            voucherDAO.DeleteVoucher(voucherId);
        }

        // Phương thức lấy tất cả Voucher.
        public List<Voucher> GetVouchers()
        {
            return voucherDAO.GetVouchers(); // Trả về danh sách tất cả Voucher từ DAO.
        }

        // Phương thức để tạo mới một Voucher.
        public void CreateVoucher(Voucher voucher)
        {
            voucherDAO.CreateVoucher(voucher);
        }

        // Phương thức để cập nhật thông tin một Voucher.
        public void UpdateVoucher(Voucher voucher)
        {
            voucherDAO.UpdateVoucher(voucher);
        }

        // Phương thức để lấy một Voucher theo tên.
        public Voucher GetSingleVoucherByName(string name)
        {
            return voucherDAO.GetVoucherByName(name); // Trả về Voucher có tên tương ứng.
        }
    }
}
