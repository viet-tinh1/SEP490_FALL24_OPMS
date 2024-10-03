using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BusinessObject.Models;

public partial class Plant
{
    public int PlantId { get; set; }
    [Required]
    public int UserId { get; set; }

    public string PlantName { get; set; } = null!;
    [Required]
    public int CategoryId { get; set; }

    public string Description { get; set; } = null!;

    public decimal Price { get; set; }

    public string ImageUrl { get; set; } = null!;

    public int? Stock { get; set; }

    public int? Status { get; set; }

    public int? IsVerfied { get; set; }


    public decimal? Discount { get; set; }
    public virtual ICollection<ShoppingCartItem> ShoppingCartItems { get; set; } = new List<ShoppingCartItem>();


    public virtual Category Category { get; set; } = null!;

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual User User { get; set; } = null!;
}
