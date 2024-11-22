using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    CategoryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Categori__19093A2B71E9E287", x => x.CategoryID);
                });

            migrationBuilder.CreateTable(
                name: "Feedback",
                columns: table => new
                {
                    FeedbackID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    FeedbackText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Rating = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Feedback__6A4BEDF6F43B81ED", x => x.FeedbackID);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Password = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    PhoneNumber = table.Column<string>(type: "varchar(20)", unicode: false, maxLength: 20, nullable: true),
                    Roles = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    IsVerifyEmail = table.Column<int>(type: "int", nullable: false),
                    UserImage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: true),
                    shop_name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    IsSellerRequest = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Users__1788CCAC5408B395", x => x.UserID);
                });

            migrationBuilder.CreateTable(
                name: "FPlants",
                columns: table => new
                {
                    FplantId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    FPlantName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    FPlantImage = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__FPlants__09421B22963E7690", x => x.FplantId);
                    table.ForeignKey(
                        name: "FK__FPlants__UserID__4316F928",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    NotificationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    SentDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    IsRead = table.Column<bool>(type: "bit", nullable: true, defaultValueSql: "((0))")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Notifica__20CF2E3217936E20", x => x.NotificationID);
                    table.ForeignKey(
                        name: "FK__Notificat__UserI__5EBF139D",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "Plants",
                columns: table => new
                {
                    PlantID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    PlantName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CategoryID = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    ImageURL = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Stock = table.Column<int>(type: "int", nullable: true, defaultValueSql: "((0))"),
                    Status = table.Column<int>(type: "int", nullable: true),
                    IsVerfied = table.Column<int>(type: "int", nullable: true, defaultValueSql: "((0))"),
                    CreateDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    discount = table.Column<decimal>(type: "decimal(5,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Plants__98FE46BCC0649373", x => x.PlantID);
                    table.ForeignKey(
                        name: "FK__Plants__Category__3F466844",
                        column: x => x.CategoryID,
                        principalTable: "Categories",
                        principalColumn: "CategoryID");
                    table.ForeignKey(
                        name: "FK__Plants__UserID__3E52440B",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "Posts",
                columns: table => new
                {
                    post_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    post_content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    post_image = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    like_post = table.Column<int>(type: "int", nullable: true),
                    createdate = table.Column<DateTime>(type: "datetime", nullable: true),
                    updated_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Posts__3ED7876638BD9BE8", x => x.post_id);
                    table.ForeignKey(
                        name: "FK__Posts__UserID__236943A5",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "Voucher",
                columns: table => new
                {
                    voucher_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    voucher_name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    voucher_percent = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    create_date = table.Column<DateTime>(type: "datetime", nullable: true),
                    close_date = table.Column<DateTime>(type: "datetime", nullable: true),
                    status = table.Column<bool>(type: "bit", nullable: true),
                    open_date = table.Column<DateTime>(type: "datetime", nullable: true),
                    amount = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    UserID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Voucher__80B6FFA86981BAF1", x => x.voucher_id);
                    table.ForeignKey(
                        name: "FK_Voucher_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "Payment",
                columns: table => new
                {
                    TransactionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BuyerID = table.Column<int>(type: "int", nullable: false),
                    PlantID = table.Column<int>(type: "int", nullable: false),
                    TransactionDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    IsSuccess = table.Column<bool>(type: "bit", nullable: true, defaultValueSql: "((0))")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Payment__55433A4B839502E1", x => x.TransactionID);
                    table.ForeignKey(
                        name: "FK__Payment__BuyerID__5535A963",
                        column: x => x.BuyerID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                    table.ForeignKey(
                        name: "FK__Payment__PlantID__5629CD9C",
                        column: x => x.PlantID,
                        principalTable: "Plants",
                        principalColumn: "PlantID");
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    ReviewID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    PlantID = table.Column<int>(type: "int", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: true),
                    Comment = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    ReviewDate = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Reviews__74BC79AE08292853", x => x.ReviewID);
                    table.ForeignKey(
                        name: "FK__Reviews__PlantID__5AEE82B9",
                        column: x => x.PlantID,
                        principalTable: "Plants",
                        principalColumn: "PlantID");
                    table.ForeignKey(
                        name: "FK__Reviews__UserID__59FA5E80",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                });

            migrationBuilder.CreateTable(
                name: "Shopping_Cart_Item",
                columns: table => new
                {
                    ShoppingCartItemId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlantID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Cart__51BCD7B7E3ACDBAD", x => x.ShoppingCartItemId);
                    table.ForeignKey(
                        name: "FK__Cart__PlantID__45F365D3",
                        column: x => x.PlantID,
                        principalTable: "Plants",
                        principalColumn: "PlantID");
                });

            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    comment_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    post_id = table.Column<int>(type: "int", nullable: false),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    comments_content = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    like_comment = table.Column<int>(type: "int", nullable: true),
                    comment_time = table.Column<DateTime>(type: "datetime", nullable: true),
                    updated_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Comments__E79576877C64DB3D", x => x.comment_id);
                    table.ForeignKey(
                        name: "FK__Comments__UserID__2739D489",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                    table.ForeignKey(
                        name: "FK__Comments__post_i__2645B050",
                        column: x => x.post_id,
                        principalTable: "Posts",
                        principalColumn: "post_id");
                });

            migrationBuilder.CreateTable(
                name: "Post_Like",
                columns: table => new
                {
                    LikeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    post_id = table.Column<int>(type: "int", nullable: false),
                    UserID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Post_Lik__A2922C143D71D738", x => x.LikeId);
                    table.ForeignKey(
                        name: "FK__Post_Like__UserI__42E1EEFE",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                    table.ForeignKey(
                        name: "FK__Post_Like__post___41EDCAC5",
                        column: x => x.post_id,
                        principalTable: "Posts",
                        principalColumn: "post_id");
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    OrderID = table.Column<int>(type: "int", nullable: false),
                    ShoppingCartItemId = table.Column<int>(type: "int", nullable: false),
                    OrderDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Status = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true, defaultValueSql: "('Pending')"),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    ShippingAddress = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PaymentMethod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    IsSuccess = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders_OrderID", x => x.OrderID);
                    table.ForeignKey(
                        name: "FK_Orders_Users",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserID");
                    table.ForeignKey(
                        name: "FK__Orders__CartId__4CA06362",
                        column: x => x.ShoppingCartItemId,
                        principalTable: "Shopping_Cart_Item",
                        principalColumn: "ShoppingCartItemId");
                });

            migrationBuilder.CreateTable(
                name: "Shopping_Cart",
                columns: table => new
                {
                    ShoppingCartItemId = table.Column<int>(type: "int", nullable: false),
                    UserID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Shopping_Cart", x => new { x.ShoppingCartItemId, x.UserID });
                    table.ForeignKey(
                        name: "FK__CartUser__CartId__48CFD27E",
                        column: x => x.ShoppingCartItemId,
                        principalTable: "Shopping_Cart_Item",
                        principalColumn: "ShoppingCartItemId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK__CartUser__UserID__47DBAE45",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReplyComment",
                columns: table => new
                {
                    reply_comment_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    comment_id = table.Column<int>(type: "int", nullable: false),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    Reply_comment_content = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    create_at = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__ReplyCom__D67290473B855866", x => x.reply_comment_id);
                    table.ForeignKey(
                        name: "FK__ReplyComm__UserI__2B0A656D",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID");
                    table.ForeignKey(
                        name: "FK__ReplyComm__comme__2A164134",
                        column: x => x.comment_id,
                        principalTable: "Comments",
                        principalColumn: "comment_id");
                });

            migrationBuilder.CreateTable(
                name: "OrderDetails",
                columns: table => new
                {
                    OrderDetailID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderID = table.Column<int>(type: "int", nullable: false),
                    PlantID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    IsPayment = table.Column<bool>(type: "bit", nullable: true, defaultValueSql: "((0))")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__OrderDet__D3B9D30C2808A6A4", x => x.OrderDetailID);
                    table.ForeignKey(
                        name: "FK_OrderDetails_OrderID",
                        column: x => x.OrderID,
                        principalTable: "Orders",
                        principalColumn: "OrderID");
                    table.ForeignKey(
                        name: "FK__OrderDeta__Plant__5165187F",
                        column: x => x.PlantID,
                        principalTable: "Plants",
                        principalColumn: "PlantID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Comments_post_id",
                table: "Comments",
                column: "post_id");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_UserID",
                table: "Comments",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_FPlants_UserID",
                table: "FPlants",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserID",
                table: "Notifications",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetails_OrderID",
                table: "OrderDetails",
                column: "OrderID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetails_PlantID",
                table: "OrderDetails",
                column: "PlantID");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_ShoppingCartItemId",
                table: "Orders",
                column: "ShoppingCartItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId",
                table: "Orders",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Payment_BuyerID",
                table: "Payment",
                column: "BuyerID");

            migrationBuilder.CreateIndex(
                name: "IX_Payment_PlantID",
                table: "Payment",
                column: "PlantID");

            migrationBuilder.CreateIndex(
                name: "IX_Plants_CategoryID",
                table: "Plants",
                column: "CategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_Plants_UserID",
                table: "Plants",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Post_Like_post_id",
                table: "Post_Like",
                column: "post_id");

            migrationBuilder.CreateIndex(
                name: "IX_Post_Like_UserID",
                table: "Post_Like",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Posts_UserID",
                table: "Posts",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_ReplyComment_comment_id",
                table: "ReplyComment",
                column: "comment_id");

            migrationBuilder.CreateIndex(
                name: "IX_ReplyComment_UserID",
                table: "ReplyComment",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_PlantID",
                table: "Reviews",
                column: "PlantID");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserID",
                table: "Reviews",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Shopping_Cart_UserID",
                table: "Shopping_Cart",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Shopping_Cart_Item_PlantID",
                table: "Shopping_Cart_Item",
                column: "PlantID");

            migrationBuilder.CreateIndex(
                name: "UQ__Users__536C85E4501EF946",
                table: "Users",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Voucher_UserID",
                table: "Voucher",
                column: "UserID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Feedback");

            migrationBuilder.DropTable(
                name: "FPlants");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "OrderDetails");

            migrationBuilder.DropTable(
                name: "Payment");

            migrationBuilder.DropTable(
                name: "Post_Like");

            migrationBuilder.DropTable(
                name: "ReplyComment");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "Shopping_Cart");

            migrationBuilder.DropTable(
                name: "Voucher");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropTable(
                name: "Shopping_Cart_Item");

            migrationBuilder.DropTable(
                name: "Posts");

            migrationBuilder.DropTable(
                name: "Plants");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
