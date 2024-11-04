using System;
using System.Collections.Generic;

namespace BusinessObject.Models;

public partial class Post
{
    public int PostId { get; set; }

    public int UserId { get; set; }

    public string PostContent { get; set; } = null!;

    public byte[]? PostImage { get; set; }

    public int? LikePost { get; set; }

    public DateTime? Createdate { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual User User { get; set; } = null!;
}
