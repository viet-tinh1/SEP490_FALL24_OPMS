﻿using System;
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

    public virtual DbSet<ShoppingCart> ShoppingCarts { get; set; }

    public virtual DbSet<ShoppingCartItem> ShoppingCartItems { get; set; }

    public virtual DbSet<Category> Categories { get; set; }
    public virtual DbSet<Comment> Comments { get; set; }

    public virtual DbSet<Fplant> Fplants { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderDetail> OrderDetails { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Post> Posts { get; set; }
    public virtual DbSet<PostLike> PostLikes { get; set; }
    public virtual DbSet<ReplyComment> ReplyComments { get; set; }

    public virtual DbSet<Feedback> Feedbacks { get; set; }

    public virtual DbSet<Plant> Plants { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<Voucher> Vouchers { get; set; }

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
        modelBuilder.Entity<ShoppingCart>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Shopping_Cart");
            entity.HasKey(e => new { e.ShoppingCartItemId, e.UserId });

            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.ShoppingCartItem).WithMany()
                .HasForeignKey(d => d.ShoppingCartItemId)
                .HasConstraintName("FK__CartUser__CartId__48CFD27E");

            entity.HasOne(d => d.User).WithMany()
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK__CartUser__UserID__47DBAE45");
        });

        modelBuilder.Entity<ShoppingCartItem>(entity =>
        {
            entity.HasKey(e => e.ShoppingCartItemId).HasName("PK__Cart__51BCD7B7E3ACDBAD");

            entity.ToTable("Shopping_Cart_Item");

            entity.Property(e => e.PlantId).HasColumnName("PlantID");

            entity.HasOne(d => d.Plant).WithMany(p => p.ShoppingCartItems)
                .HasForeignKey(d => d.PlantId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Cart__PlantID__45F365D3");
        });
        //modelBuilder.Entity<Cart>(entity =>
        //{
        //    entity.HasKey(e => e.CartId).HasName("PK__Cart__51BCD7B7E3ACDBAD");

        //    entity.ToTable("Cart");

        //    entity.Property(e => e.PlantId).HasColumnName("PlantID");

        //    entity.HasOne(d => d.Plant).WithMany(p => p.Carts)
        //        .HasForeignKey(d => d.PlantId)
        //        .OnDelete(DeleteBehavior.ClientSetNull)
        //        .HasConstraintName("FK__Cart__PlantID__45F365D3");
        //});

        //modelBuilder.Entity<CartUser>(entity =>
        //{
        //    entity.ToTable("CartUser");

        //    entity.HasKey(e => new { e.CartId, e.UserId }); // Khóa chính kết hợp giữa CartId và UserId

        //    entity.Property(e => e.UserId).HasColumnName("UserID");

        //    entity.HasOne(d => d.Cart).WithMany()
        //        .HasForeignKey(d => d.CartId)
        //        .HasConstraintName("FK__CartUser__CartId__48CFD27E");

        //    entity.HasOne(d => d.User).WithMany()
        //        .HasForeignKey(d => d.UserId)
        //        .HasConstraintName("FK__CartUser__UserID__47DBAE45");
        //});

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Categori__19093A2B71E9E287");

            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.CategoryName).HasMaxLength(100);
        });

        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.CommentId).HasName("PK__Comments__E79576877C64DB3D");

            entity.Property(e => e.CommentId).HasColumnName("comment_id");
            entity.Property(e => e.CommentTime)
                .HasColumnType("datetime")
                .HasColumnName("comment_time");
            entity.Property(e => e.CommentsContent)
                .HasMaxLength(255)
                .HasColumnName("comments_content");
            entity.Property(e => e.LikeComment).HasColumnName("like_comment");
            entity.Property(e => e.PostId).HasColumnName("post_id");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Post).WithMany(p => p.Comments)
                .HasForeignKey(d => d.PostId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Comments__post_i__2645B050");

            entity.HasOne(d => d.User).WithMany(p => p.Comments)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Comments__UserID__2739D489");
        });
        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__6A4BEDF6F43B81ED");

            entity.ToTable("Feedback");

            entity.Property(e => e.FeedbackId).HasColumnName("FeedbackID");
            entity.Property(e => e.CreatedAt).HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.Rating).HasMaxLength(255);
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
            entity.HasKey(e => e.OrderId).HasName("PK_Orders_OrderID");

            entity.Property(e => e.OrderId)
                .ValueGeneratedNever()
                .HasColumnName("OrderID");
            entity.Property(e => e.OrderDate).HasColumnType("datetime");
            entity.Property(e => e.PaymentMethod).HasMaxLength(50);
            entity.Property(e => e.Status)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValueSql("('Pending')");
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.ShoppingCartItem).WithMany(p => p.Orders)
                .HasForeignKey(d => d.ShoppingCartItemId)
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
               .HasConstraintName("FK_OrderDetails_OrderID");

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
            entity.Property(e => e.CreateDate).HasColumnType("datetime");
            entity.Property(e => e.Description).HasColumnType("nvarchar(max)");
            entity.Property(e => e.Discount)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("discount");
            entity.Property(e => e.ImageUrl).HasColumnName("ImageURL");
            entity.Property(e => e.IsVerfied).HasDefaultValueSql("((0))");
            entity.Property(e => e.PlantName).HasMaxLength(100);
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
            entity.Property(e => e.Comment).HasMaxLength(255);
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

        modelBuilder.Entity<ReplyComment>(entity =>
        {
            entity.HasKey(e => e.ReplyCommentId).HasName("PK__ReplyCom__D67290473B855866");

            entity.ToTable("ReplyComment");

            entity.Property(e => e.ReplyCommentId).HasColumnName("reply_comment_id");
            entity.Property(e => e.CommentId).HasColumnName("comment_id");
            entity.Property(e => e.CreateAt)
                .HasColumnType("datetime")
                .HasColumnName("create_at");
            entity.Property(e => e.ReplyCommentContent)
                .HasMaxLength(255)
                .HasColumnName("Reply_comment_content");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Comment).WithMany(p => p.ReplyComments)
                .HasForeignKey(d => d.CommentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ReplyComm__comme__2A164134");

            entity.HasOne(d => d.User).WithMany(p => p.ReplyComments)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ReplyComm__UserI__2B0A656D");
        });
        modelBuilder.Entity<Post>(entity =>
        {
            entity.HasKey(e => e.PostId).HasName("PK__Posts__3ED7876638BD9BE8");

            entity.Property(e => e.PostId).HasColumnName("post_id");
            entity.Property(e => e.Createdate)
                .HasColumnType("datetime")
                .HasColumnName("createdate");
            entity.Property(e => e.LikePost).HasColumnName("like_post");
            entity.Property(e => e.PostContent).HasColumnName("post_content");
            entity.Property(e => e.PostImage).HasColumnName("post_image");
            entity.Property(e => e.UpdatedAt)
                .HasColumnType("datetime")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.Posts)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Posts__UserID__236943A5");
        });
        modelBuilder.Entity<PostLike>(entity =>
        {
            entity.HasKey(e => e.LikeId).HasName("PK__Post_Lik__A2922C143D71D738");

            entity.ToTable("Post_Like");

            entity.Property(e => e.PostId).HasColumnName("post_id");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.Post).WithMany(p => p.PostLikes)
                .HasForeignKey(d => d.PostId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Post_Like__post___41EDCAC5");

            entity.HasOne(d => d.User).WithMany(p => p.PostLikes)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Post_Like__UserI__42E1EEFE");
        });
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCAC5408B395");

            entity.HasIndex(e => e.Username, "UQ_Users_Username").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.ShopName)
                .HasMaxLength(100)
                .HasColumnName("shop_name");
            //entity.Property(e => e.IsVerifyEmail)
            //    .HasColumnName("IsVerifyEmail")
            //    .HasDefaultValue(0);
            //entity.Property(e => e.UserImage)
            //    .HasColumnName("UserImage")
            //    .HasColumnType("VARBINARY(MAX)");
            //entity.Property(e => e.IsSellerRequest)
            //    .HasColumnName("IsSellerRequest")
            //    .HasDefaultValue(0);
            entity.Property(e => e.Username).HasMaxLength(100);
        });
        modelBuilder.Entity<Voucher>(entity =>
        {
            entity.HasKey(e => e.VoucherId).HasName("PK__Voucher__80B6FFA86981BAF1");

            entity.ToTable("Voucher");

            entity.Property(e => e.VoucherId).HasColumnName("voucher_id");
            entity.Property(e => e.Amount)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("amount");
            entity.Property(e => e.CloseDate)
                .HasColumnType("datetime")
                .HasColumnName("close_date");
            entity.Property(e => e.CreateDate)
                .HasColumnType("datetime")
                .HasColumnName("create_date");
            entity.Property(e => e.OpenDate)
                .HasColumnType("datetime")
                .HasColumnName("open_date");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.VoucherName)
                .HasMaxLength(255)
                .HasColumnName("voucher_name");
            entity.Property(e => e.VoucherPercent)
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("voucher_percent");

            entity.HasOne(d => d.User).WithMany(p => p.Vouchers)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_Voucher_UserID");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
