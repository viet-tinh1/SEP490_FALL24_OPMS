using System;
using System.Collections.Generic;

namespace BusinessObject.Models;

public partial class ShoppingCart
{
    public int? ShoppingCartItemId { get; set; }

    public int? UserId { get; set; }

    public virtual ShoppingCartItem? ShoppingCartItem { get; set; } 

    public virtual User? User { get; set; }
}
