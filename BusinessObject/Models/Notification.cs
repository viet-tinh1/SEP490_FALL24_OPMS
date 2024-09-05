using System;
using System.Collections.Generic;

namespace BusinessObject.Models;

public partial class Notification
{
    public int NotificationId { get; set; }

    public int UserId { get; set; }

    public string Content { get; set; } = null!;

    public DateTime SentDate { get; set; }

    public bool? IsRead { get; set; }

    public virtual User User { get; set; } = null!;
}
