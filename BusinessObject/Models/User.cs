using System;
using System.Collections.Generic;

namespace BusinessObject.Models;

public partial class User
{
    public int UserId { get; set; }

    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? PhoneNumber { get; set; }

    public int Roles { get; set; }

    public string? FullName { get; set; }

    public string? Address { get; set; }

    public DateTime? CreatedDate { get; set; }

    public string? UserImage { get; set; }

    public int? Status { get; set; }
    public string? ShopName { get; set; }

    public virtual ICollection<Fplant> Fplants { get; set; } = new List<Fplant>();

    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    public virtual ICollection<Plant> Plants { get; set; } = new List<Plant>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
    public virtual ICollection<Voucher> Vouchers { get; set; } = new List<Voucher>();
}
