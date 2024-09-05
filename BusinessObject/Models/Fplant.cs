using System;
using System.Collections.Generic;

namespace BusinessObject.Models;

public partial class Fplant
{
    public int FplantId { get; set; }

    public int UserId { get; set; }

    public string? FplantName { get; set; }

    public string? FplantImage { get; set; }

    public string? Description { get; set; }

    public DateTime? CreatedDate { get; set; }

    public virtual User User { get; set; } = null!;
}
