using System;
using System.Collections.Generic;

namespace BusinessObject.Models;

public partial class CartUser
{
    public int? CartId { get; set; }

    public int? UserId { get; set; }

    public virtual Cart? Cart { get; set; }

    public virtual User? User { get; set; }
}
