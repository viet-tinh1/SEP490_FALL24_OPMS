using System;
using System.Collections.Generic;

namespace BusinessObject.Models;

public partial class Report
{
    public int ReportId { get; set; }

    public int UserId { get; set; }

    public int PlantId { get; set; }

    public int ReasonsId { get; set; }

    public string? ReportContent { get; set; }

    public DateTime? CreatedDate { get; set; }

    public virtual Plant Plant { get; set; } = null!;

    public virtual Reason Reasons { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
