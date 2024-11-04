using System;
using System.Collections.Generic;

namespace BusinessObject.Models;

public partial class ReplyComment
{
    public int ReplyCommentId { get; set; }

    public int CommentId { get; set; }

    public int UserId { get; set; }

    public string ReplyCommentContent { get; set; } = null!;

    public DateTime? CreateAt { get; set; }

    public virtual Comment Comment { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
