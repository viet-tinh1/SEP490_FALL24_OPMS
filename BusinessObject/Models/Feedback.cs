using System;
using System.Collections.Generic;

namespace BusinessObject.Models;

public partial class Feedback
{
    public int FeedbackId { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string FeedbackText { get; set; } = null!;

    public string? Rating { get; set; }

    public DateTime? CreatedAt { get; set; }
}
