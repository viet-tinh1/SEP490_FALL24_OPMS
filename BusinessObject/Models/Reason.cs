using System;
using System.Collections.Generic;

namespace BusinessObject.Models;

public partial class Reason
{
    public int ReasonsId { get; set; }

    public string? Reasons { get; set; }

    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();
}
