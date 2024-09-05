using System;
using System.Collections.Generic;

namespace BusinessObject.Models;

public partial class Order
{
    public int OrderId { get; set; }

    public int CartId { get; set; }

    public DateTime OrderDate { get; set; }

    public decimal TotalAmount { get; set; }

    public string? Status { get; set; }

    public virtual Cart Cart { get; set; } = null!;

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
