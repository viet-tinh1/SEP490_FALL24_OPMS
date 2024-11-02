/*
    Project: OPMS_ Database Initialization Script
    Description: Script tạo cấu trúc cơ sở dữ liệu cho hệ thống BSM_
    Author: [Tên của bạn hoặc tên nhóm]
    Created Date: [Ngày khởi tạo]

    Change Log:
    -------------------------------------------------------------------------------------------------------------------------------------
    |   Date       |  Modified By    |   Description                                                                                    |
    -------------------------------------------------------------------------------------------------------------------------------------
    | 2024-09-04   | TinhNV          | Khởi tạo cơ sở dữ liệu và các bảng chính                                                         |
    | 2024-09-04   | TinhNV          | Thêm bảng ChangeLog để ghi lại thay đổi                                                          |
    | 2024-09-15   | TinhNV          | Sửa bảng Orders, thêm cột userId                                                                 |
    | 2024-09-29   | TinhNV          | Update database after review 1                                                                   |
    | 2024-10-04   | TinhNV          | Thêm bảng Vouchers để quản lý mã giảm giá                                                        |
    | 2024-10-27   | TinhNV          | Update database after review 2                                                                   |
    | 2024-10-28   | TinhNV          | Sửa bảng Vouchers,thêm cột UserId để quản lý mã giảm giá                                         |
    | 2024-10-30   | TinhNV          | Sửa bảng Users để quản lý cửa hàng                                                               |
    | 2024-11-02   | TinhNV          | Chỉnh data bảng User (add cột IsVerifyEmail, chỉnh cột UserImage từ kiểu nvarchar sang varbinary |
    | 2024-11-02   | TinhNV          | Chỉnh data bảng Plants (chỉnh cột ImageURL từ kiểu nvarchar sang varbinary                       |
    -------------------------------------------------------------------------------------------------------------------------------------

    Notes:
    - Cấu trúc bảng có thể được mở rộng thêm trong tương lai để phù hợp với các yêu cầu mới.
    - Tham khảo bảng ChangeLog để theo dõi chi tiết các thay đổi trong dữ liệu.
*/



create database BSM_
use BSM_

--- loại cây of Admin
CREATE TABLE Categories (
    CategoryID		INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName	VARCHAR(100) NOT NULL
);
---- Tạo người dùng
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    Username VARCHAR(50) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(20) NULL,
    Roles INT NOT NULL,
    FullName NVARCHAR(100) NULL,
    Address NVARCHAR(255) NULL,
    CreatedDate DATETIME NULL,
    UserImage VARBINARY(MAX) NULL,
    Status INT NULL,
    shop_name NVARCHAR(100) NULL,
    IsVerifyEmail INT NOT NULL DEFAULT 0
);

-- chi tiết cây 
CREATE TABLE Plants (
    PlantID INT PRIMARY KEY IDENTITY(1,1),
    CategoryID INT NOT NULL,
    PlantName NVARCHAR(100),
    Description NVARCHAR(255),
    ImageURL VARBINARY(255),
    CreateDate DATETIME,
    Price DECIMAL(10, 2),
    Discount DECIMAL(5, 2),
    Stock INT DEFAULT 0,
    IsVerfied INT DEFAULT 0,
    UserID INT NOT NULL,
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
-----
--- Tìm Mua cây
CREATE TABLE FPlants(
	FPlantId INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    UserID INT NOT NULL,
    FPlantName NVARCHAR(255) NULL,
    FPlantImage NVARCHAR(255) NULL,
    Description NVARCHAR(255) NULL,
    CreatedDate DATETIME NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
	);
	
-- Giỏ hàng 
CREATE TABLE Shopping_Cart_Item (
    ShoppingCartItemId INT PRIMARY KEY IDENTITY(1,1),
    PlantID INT NOT NULL,
    Quantity INT NOT NULL,
    FOREIGN KEY (PlantID) REFERENCES Plants(PlantID)
);
--- Giỏ hàng của 1 user
CREATE TABLE Shopping_Cart (
    ShoppingCartItemId INT NOT NULL,
    UserID INT NOT NULL,
    PRIMARY KEY (ShoppingCartItemId, UserID),
    FOREIGN KEY (ShoppingCartItemId) REFERENCES Shopping_Cart_Item(ShoppingCartItemId),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
-- Mua hàng 
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY NOT NULL,
    ShoppingCartItemId INT NOT NULL,
    OrderDate DATETIME NOT NULL,
    TotalAmount DECIMAL(10, 2) NOT NULL,
    Status		VARCHAR(50) DEFAULT 'Pending',
    UserId INT NOT NULL,
    FOREIGN KEY (ShoppingCartItemId) REFERENCES Shopping_Cart_Item(ShoppingCartItemId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
-- Chi tiết đơn hàng
CREATE TABLE OrderDetails (
    OrderDetailID INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    OrderID INT NOT NULL,
    PlantID INT NOT NULL,
    Quantity INT NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    IsPayment BIT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (PlantID) REFERENCES Plants(PlantID)
);

-- Thanh toán
CREATE TABLE Payment (
    TransactionID		INT IDENTITY(1,1) PRIMARY KEY,
    BuyerID				INT NOT NULL,
    PlantID				INT NOT NULL,
    TransactionDate		DATETIME NOT NULL,
    Amount				DECIMAL(10, 2) NOT NULL,
	IsSuccess           bit DEFAULT 0,
    FOREIGN KEY (BuyerID) REFERENCES Users(UserID),
    FOREIGN KEY (PlantID) REFERENCES Plants(PlantID)
	
);

-- Đánh giá
CREATE TABLE Reviews (
    ReviewID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL, -- 
    PlantID INT NOT NULL,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Comment TEXT NOT NULL,
    ReviewDate DATETIME,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (PlantID) REFERENCES Plants(PlantID)
);

-- Thông báo
CREATE TABLE Notifications (
   NotificationID INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    UserID INT NOT NULL,
    Content TEXT NOT NULL,
    SentDate DATETIME NOT NULL,
    IsRead BIT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Voucher
CREATE TABLE Vouchers (
    voucher_id INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    voucher_name NVARCHAR(255) NULL,
    voucher_percent DECIMAL(5, 2) NULL,
    create_date DATETIME NULL,
    close_date DATETIME NULL,
    status BIT NULL,
    open_date DATETIME NULL,
    amount DECIMAL(10, 2) NULL,
    UserID INT NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

