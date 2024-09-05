using System;
using System.Collections.Generic;

namespace BusinessObject.Models;

public partial class Category
{
    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public virtual ICollection<Plant> Plants { get; set; } = new List<Plant>();
}
