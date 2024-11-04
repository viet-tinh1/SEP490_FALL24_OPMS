using System;
using System.Collections.Generic;

namespace BusinessObject.Models;

public partial class Comment
{
    public int CommentId { get; set; }

    public int PostId { get; set; }

    public int UserId { get; set; }

    public string CommentsContent { get; set; } = null!;

    public int? LikeComment { get; set; }

    public DateTime? CommentTime { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual Post Post { get; set; } = null!;

    public virtual ICollection<ReplyComment> ReplyComments { get; set; } = new List<ReplyComment>();

    public virtual User User { get; set; } = null!;
}
