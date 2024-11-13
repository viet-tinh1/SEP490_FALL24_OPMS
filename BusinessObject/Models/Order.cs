using System;
using System.Collections.Generic;

namespace BusinessObject.Models;

public partial class Order
{
    public int OrderId { get; set; }

    public int ShoppingCartItemId { get; set; }

    public DateTime OrderDate { get; set; }

    public decimal TotalAmount { get; set; }

    public string? Status { get; set; }

    public int? UserId { get; set; }
    public string? ShippingAddress { get; set; }
    public string? PaymentMethod { get; set; }

    public int? IsSuccess { get; set; }

    public virtual ShoppingCartItem ShoppingCartItem { get; set; } = null!;

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

    public virtual User? User { get; set; }
}
