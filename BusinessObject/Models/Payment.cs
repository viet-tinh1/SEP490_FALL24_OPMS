using System;
using System.Collections.Generic;

namespace BusinessObject.Models;

public partial class Payment
{
    public int TransactionId { get; set; }

    public int BuyerId { get; set; }

    public int PlantId { get; set; }

    public DateTime TransactionDate { get; set; }

    public decimal Amount { get; set; }

    public bool? IsSuccess { get; set; }

    public virtual User Buyer { get; set; } = null!;

    public virtual Plant Plant { get; set; } = null!;
}
