using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace BusinessObject.Models;

public partial class Db6213Context : DbContext
{
    public Db6213Context()
    {
    }

    public Db6213Context(DbContextOptions<Db6213Context> options)
        : base(options)
    {
    }

    public virtual DbSet<Cart> Carts { get; set; }

    public virtual DbSet<CartUser> CartUsers { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Fplant> Fplants { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderDetail> OrderDetails { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Plant> Plants { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<User> Users { get; set; }

    /*protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=db6213.public.databaseasp.net;Database=db6213;User Id=db6213;Password=FINAL@2024;TrustServerCertificate=True;Encrypt=false;");
    */
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var builder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", true, true);
        IConfigurationRoot config = builder.Build();
        optionsBuilder.UseSqlServer(config.GetConnectionString("OPMSConnection"));
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasKey(e => e.CartId).HasName("PK__Cart__51BCD7B7E3ACDBAD");

            entity.ToTable("Cart");

            entity.Property(e => e.PlantId).HasColumnName("PlantID");

            entity.HasOne(d => d.Plant).WithMany(p => p.Carts)
                .HasForeignKey(d => d.PlantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Cart__PlantID__45F365D3");
        });

        modelBuilder.Entity<CartUser>(entity =>
        {
            entity.ToTable("CartUser");

            entity.HasKey(e => new { e.CartId, e.UserId }); // Khóa chính kết hợp giữa CartId và UserId

            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Cart).WithMany()
                .HasForeignKey(d => d.CartId)
                .HasConstraintName("FK__CartUser__CartId__48CFD27E");

            entity.HasOne(d => d.User).WithMany()
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__CartUser__UserID__47DBAE45");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Categori__19093A2B71E9E287");

            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.CategoryName)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Fplant>(entity =>
        {
            entity.HasKey(e => e.FplantId).HasName("PK__FPlants__09421B22963E7690");

            entity.ToTable("FPlants");

            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.FplantImage)
                .HasMaxLength(255)
                .HasColumnName("FPlantImage");
            entity.Property(e => e.FplantName)
                .HasMaxLength(255)
                .HasColumnName("FPlantName");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.Fplants)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__FPlants__UserID__4316F928");
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__20CF2E3217936E20");

            entity.Property(e => e.NotificationId).HasColumnName("NotificationID");
            entity.Property(e => e.Content).HasColumnType("text");
            entity.Property(e => e.IsRead).HasDefaultValueSql("((0))");
            entity.Property(e => e.SentDate).HasColumnType("datetime");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.Notifications)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Notificat__UserI__5EBF139D");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__Orders__C3905BAFBF586BD6");

            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.OrderDate).HasColumnType("datetime");
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValueSql("('Pending')");
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.Cart).WithMany(p => p.Orders)
                .HasForeignKey(d => d.CartId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Orders__CartId__4CA06362");
            entity.HasOne(d => d.User).WithMany(p => p.Orders)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_Orders_Users");
        });

        modelBuilder.Entity<OrderDetail>(entity =>
        {
            entity.HasKey(e => e.OrderDetailId).HasName("PK__OrderDet__D3B9D30C2808A6A4");

            entity.Property(e => e.OrderDetailId).HasColumnName("OrderDetailID");
            entity.Property(e => e.IsPayment).HasDefaultValueSql("((0))");
            entity.Property(e => e.OrderId).HasColumnName("OrderID");
            entity.Property(e => e.PlantId).HasColumnName("PlantID");
            entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OrderDeta__Order__5070F446");

            entity.HasOne(d => d.Plant).WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.PlantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OrderDeta__Plant__5165187F");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.TransactionId).HasName("PK__Payment__55433A4B839502E1");

            entity.ToTable("Payment");

            entity.Property(e => e.TransactionId).HasColumnName("TransactionID");
            entity.Property(e => e.Amount).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.BuyerId).HasColumnName("BuyerID");
            entity.Property(e => e.IsSuccess).HasDefaultValueSql("((0))");
            entity.Property(e => e.PlantId).HasColumnName("PlantID");
            entity.Property(e => e.TransactionDate).HasColumnType("datetime");

            entity.HasOne(d => d.Buyer).WithMany(p => p.Payments)
                .HasForeignKey(d => d.BuyerId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Payment__BuyerID__5535A963");

            entity.HasOne(d => d.Plant).WithMany(p => p.Payments)
                .HasForeignKey(d => d.PlantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Payment__PlantID__5629CD9C");
        });

        modelBuilder.Entity<Plant>(entity =>
        {
            entity.HasKey(e => e.PlantId).HasName("PK__Plants__98FE46BCC0649373");

            entity.Property(e => e.PlantId).HasColumnName("PlantID");
            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.ImageUrl)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("ImageURL");
            entity.Property(e => e.IsVerfied).HasDefaultValueSql("((0))");
            entity.Property(e => e.PlantName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Price).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Stock).HasDefaultValueSql("((0))");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Category).WithMany(p => p.Plants)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Plants__Category__3F466844");

            entity.HasOne(d => d.User).WithMany(p => p.Plants)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Plants__UserID__3E52440B");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.ReviewId).HasName("PK__Reviews__74BC79AE08292853");

            entity.Property(e => e.ReviewId).HasColumnName("ReviewID");
            entity.Property(e => e.Comment).HasColumnType("text");
            entity.Property(e => e.PlantId).HasColumnName("PlantID");
            entity.Property(e => e.ReviewDate).HasColumnType("datetime");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Plant).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.PlantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Reviews__PlantID__5AEE82B9");

            entity.HasOne(d => d.User).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Reviews__UserID__59FA5E80");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCAC5408B395");

            entity.HasIndex(e => e.Username, "UQ__Users__536C85E4501EF946").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Address)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.FullName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.UserImage).HasMaxLength(255);
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
