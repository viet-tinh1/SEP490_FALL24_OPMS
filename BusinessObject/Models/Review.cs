using System;
using System.Collections.Generic;

namespace BusinessObject.Models;

public partial class Review
{
    public int ReviewId { get; set; }

    public int UserId { get; set; }

    public int PlantId { get; set; }

    public int? Rating { get; set; }

    public string Comment { get; set; } = null!;

    public DateTime? ReviewDate { get; set; }

    public virtual Plant Plant { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
