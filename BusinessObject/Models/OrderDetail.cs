using System;
using System.Collections.Generic;

namespace BusinessObject.Models;

public partial class OrderDetail
{
    public int OrderDetailId { get; set; }

    public int OrderId { get; set; }

    public int PlantId { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }

    public bool? IsPayment { get; set; }

    public virtual Order Order { get; set; } = null!;

    public virtual Plant Plant { get; set; } = null!;
}
