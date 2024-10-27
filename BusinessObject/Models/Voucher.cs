using System;
using System.Collections.Generic;

namespace BusinessObject.Models;

public partial class Voucher
{
    public int VoucherId { get; set; }

    public string? VoucherName { get; set; }

    public decimal? VoucherPercent { get; set; }

    public DateTime? CreateDate { get; set; }

    public DateTime? CloseDate { get; set; }

    public bool? Status { get; set; }

    public DateTime? OpenDate { get; set; }

    public decimal? Amount { get; set; }

    public int? UserId { get; set; }

    public virtual User? User { get; set; }
}
