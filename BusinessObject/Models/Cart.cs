using System;
using System.Collections.Generic;

namespace BusinessObject.Models;

public partial class Cart
{
    public int CartId { get; set; }

    public int PlantId { get; set; }

    public int Quantity { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual Plant Plant { get; set; } = null!;
}
