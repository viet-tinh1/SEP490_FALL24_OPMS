using BusinessObject.Models;
using DataAccess.DTO;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DAO
{
    public class PlantDAO
    {
        // Khởi tạo đối tượng Db6213Context để tương tác với cơ sở dữ liệu.
        readonly Db6213Context _context = new Db6213Context();

        public PlantDAO()
        {
        }

        public PlantDAO(Db6213Context context)
        {
            _context = context;
        }

        // Phương thức lấy tất cả Plant đã Verfied từ cơ sở dữ liệu.
        public List<Plant> getPlant()
        {
            return _context.Plants.ToList(); // Trả về danh sách tất cả Plant.
        }
        //lấy tất cả plant đã Verified
        public List<Plant> getVerifiedPlants()
        {
            return _context.Plants
                           .Where(p => p.IsVerfied == 1) // Only return plants with isVerfied = 1
                           .ToList();
        }
        //lấy tất cả plant chưa Verified
        public List<Plant> getNonVerifiedPlants()
        {
            return _context.Plants
                           .Where(p => p.IsVerfied == 0) // Only return plants with isVerfied = 0
                           .ToList();
        }
        // Phương thức xóa một Plant theo ID.
        public void deletePlant(int id)
        {
            var p = _context.Plants.FirstOrDefault(x => x.PlantId == id); // Tìm Plant với ID.
            _context.Plants.Remove(p); // Xóa Plant.
            _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
        }

        // Phương thức tạo mới một Plant.
        public void createPlant(Plant p)
        {
            _context.Plants.Add(p); // Thêm Plant vào database.
            _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
        }

        // Phương thức cập nhật một Plant đã có.
        public void updatePlant(Plant p)
        {
            Plant plant = _context.Plants.FirstOrDefault(x => x.PlantId == p.PlantId); // Tìm Plant theo ID.
            plant.PlantName = p.PlantName;
            plant.CategoryId = p.CategoryId;
            plant.Description = p.Description;
            plant.Price = p.Price;
            plant.ImageUrl = p.ImageUrl;
            plant.Stock = p.Stock;
            plant.Status = p.Status;
            plant.Discount = p.Discount;
            plant.CreateDate= p.CreateDate;
            _context.Plants.Update(plant); // Cập nhật Plant trong cơ sở dữ liệu.
            _context.SaveChanges(); // Lưu thay đổi vào cơ sở dữ liệu.
        }

        // Phương thức lấy một Plant theo ID.
        public Plant getPlanttById(int id)
        {
            return _context.Plants.FirstOrDefault(x => x.PlantId == id); // Trả về Plant có ID tương ứng.
        }
        public List<Plant> getPlantByUser(int  UserId)
        {
            return _context.Plants
                           .Where(p => p.UserId == UserId) // Only return plants with userId
                           .ToList();
        }
        public List<Plant> getPlantByUserIsVerify(int UserId)
        {
            return _context.Plants
                           .Where(p => p.UserId == UserId && p.IsVerfied == 1) // Chỉ trả về các plants với isVerfied = 1
                           .ToList();
        }
        // lấy bán chạy nhất toàn hệ thống
        public async Task<List<PlantDTOS>> GetMostPurchasedPlantsFromShoppingCartAsync(int limit)
        {
            return await _context.ShoppingCartItems
                .Where(sci => sci.Plant.IsVerfied == 1)
                .GroupBy(sci => sci.PlantId) // Nhóm theo PlantId
                .Select(g => new
                {
                    PlantId = g.Key,
                    TotalQuantity = g.Sum(sci => sci.Quantity) // Tính tổng số lượng đã mua cho mỗi PlantId
                })
                .OrderByDescending(g => g.TotalQuantity) // Sắp xếp theo tổng số lượng mua (giảm dần)
                .Take(limit) // Giới hạn số lượng sản phẩm trả về
                .Join(_context.Plants, g => g.PlantId, p => p.PlantId, (g, p) => new PlantDTOS
                {
                    PlantId = p.PlantId,
                    PlantName = p.PlantName,
                    CategoryId = p.CategoryId,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    Stock = p.Stock,
                    Discount = p.Discount,
                    TotalPurchased = g.TotalQuantity // Gán tổng số lượng đã mua cho mỗi Plant
                })
                .ToListAsync(); // Trả về danh sách bất đồng bộ
        }
        // lấy bán chạy nhất của 1 shop
        //public async Task<List<PlantDTOS>> GetMostPurchasedPlantsByShopFromShoppingCartAsync(int limit, int userId)
        //{
        //    return await _context.ShoppingCartItems
        //        .Where(sci => sci.Plant.UserId == userId && sci.Plant.IsVerfied ==1)
        //        .GroupBy(sci => sci.PlantId) // Nhóm theo PlantId
        //        .Select(g => new
        //        {
        //            PlantId = g.Key,
        //            TotalQuantity = g.Sum(sci => sci.Quantity) // Tính tổng số lượng đã mua cho mỗi PlantId
        //        })
        //        .OrderByDescending(g => g.TotalQuantity) // Sắp xếp theo tổng số lượng mua (giảm dần)
        //        .Take(limit) // Giới hạn số lượng sản phẩm trả về
        //        .Join(_context.Plants, g => g.PlantId, p => p.PlantId, (g, p) => new PlantDTOS
        //        {
        //            PlantId = p.PlantId,
        //            PlantName = p.PlantName,
        //            CategoryId = p.CategoryId,
        //            Price = p.Price,
        //            ImageUrl = p.ImageUrl ,
        //            Discount = p.Discount,
        //            UserId = p.UserId,
        //            Stock = p.Stock,
        //            TotalPurchased = g.TotalQuantity // Gán tổng số lượng đã mua cho mỗi Plant
        //        })
        //        .ToListAsync(); // Trả về danh sách bất đồng bộ
        //}
        // Phương thức tìm kiếm toàn hệ thống 
        public List<PlantDTOS> searchPlants(int? limit = null, string name = null, List<int> categoryId = null, decimal? minPrice = null, decimal? maxPrice = null, int? sortOption = null)

        {
            // Khởi tạo query cơ bản
            var query = _context.Plants.AsQueryable();
            // Chỉ lấy những sản phẩm có IsVerfied == 1
            query = query.Where(p => p.IsVerfied == 1);

            // Điều kiện tìm kiếm theo tên nếu có tham số name
            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(p => p.PlantName.ToLower().Contains(name.ToLower()));
            }

            // Điều kiện tìm kiếm theo category nếu có tham số categoryId

            if (categoryId != null && categoryId.Count > 0)
            {
                query = query.Where(p => categoryId.Contains(p.CategoryId));

            }

            // Điều kiện tìm kiếm theo giá tối thiểu nếu có tham số minPrice
            if (minPrice.HasValue)
            {
                query = query.Where(p => (p.Price -(p.Price *(p.Discount/100))) >= minPrice.Value);
            }

            // Điều kiện tìm kiếm theo giá tối đa nếu có tham số maxPrice
            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }
            // Apply sorting based on sortOption: 1 for ascending, 2 for descending
            if (sortOption == 3)
            {
                query = query.OrderBy(p => p.Price - (p.Price * (p.Discount / 100)));
            }
            else if (sortOption == 4)
            {
                query = query.OrderByDescending(p => p.Price - (p.Price * (p.Discount / 100)));
            }
            else if (sortOption == 1) // Sắp xếp sản phẩm mới nhất đến cũ nhất
            {
                query = query.OrderByDescending(p => p.CreateDate);
            }
            if (sortOption == 2)
            {
                var salesQuery = _context.ShoppingCartItems
                    .Where(sci => sci.Plant.IsVerfied == 1)
                    .GroupBy(sci => sci.PlantId) // Nhóm theo PlantId
                    .Select(g => new { PlantId = g.Key, TotalQuantity = g.Sum(sci => sci.Quantity) });

                var bestSellingQuery = salesQuery
                    .Join(
                        _context.Plants,
                        g => g.PlantId,
                        p => p.PlantId,
                        (g, p) => new PlantDTOS
                        {
                            PlantId = p.PlantId,
                            PlantName = p.PlantName,
                            CategoryId = p.CategoryId,
                            Price = p.Price,
                            ImageUrl = p.ImageUrl,
                            Discount = p.Discount,
                            UserId = p.UserId,
                            Stock = p.Stock,
                            Status = p.Status,
                            TotalPurchased = g.TotalQuantity
                        })
                    .OrderByDescending(p => p.TotalPurchased);

                // Áp dụng lọc bổ sung (nếu cần)
                if (!string.IsNullOrEmpty(name))
                {
                    bestSellingQuery = (IOrderedQueryable<PlantDTOS>)bestSellingQuery.Where(p => p.PlantName.ToLower().Contains(name.ToLower()));
                }
                if (categoryId != null && categoryId.Count > 0)
                {
                    bestSellingQuery = (IOrderedQueryable<PlantDTOS>)bestSellingQuery.Where(p => categoryId.Contains(p.CategoryId));
                }
                return bestSellingQuery.ToList();
            }


            // Trả về danh sách các kết quả phù hợp
            return query.Select(p => new PlantDTOS
            {
                PlantId = p.PlantId,
                PlantName = p.PlantName,
                CategoryId = p.CategoryId,
                Price = p.Price,
                ImageUrl = p.ImageUrl,
                Discount = p.Discount,
                UserId = p.UserId,
                Stock = p.Stock,
                Status = p.Status,
                TotalPurchased = 0 // Không có dữ liệu bán
            }).ToList();
        }

        // tìm kiếm trong 1 shop
        public List<PlantDTOS> SearchPlantsByShop(int userId, string name, List<int> categoryId, decimal? minPrice, decimal? maxPrice, int? sortOption, int? limit)
        {
            // Query cơ bản
            var query = _context.Plants.AsQueryable()
                .Where(p => p.IsVerfied == 1 && p.UserId == userId);

            // Lọc theo tên
            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(p => p.PlantName.ToLower().Contains(name.ToLower()));
            }

            // Lọc theo danh mục
            if (categoryId != null && categoryId.Count > 0)
            {
                query = query.Where(p => categoryId.Contains(p.CategoryId));
            }

            // Lọc theo giá
            if (minPrice.HasValue)
            {
                query = query.Where(p => (p.Price - (p.Price * (p.Discount / 100))) >= minPrice.Value);
            }
            if (maxPrice.HasValue)
            {
                query = query.Where(p => (p.Price - (p.Price * (p.Discount / 100))) <= maxPrice.Value);
            }

            // Trường hợp sắp xếp "bán chạy nhất"
            if (sortOption == 2)
            {
                var salesQuery = _context.ShoppingCartItems
                    .Where(sci => sci.Plant.UserId == userId)
                    .GroupBy(sci => sci.PlantId)
                    .Select(g => new { PlantId = g.Key, TotalQuantity = g.Sum(sci => sci.Quantity) });

                var bestSellingQuery = salesQuery
                    .Join(
                        _context.Plants,
                        g => g.PlantId,
                        p => p.PlantId,
                        (g, p) => new PlantDTOS
                        {
                            PlantId = p.PlantId,
                            PlantName = p.PlantName,
                            CategoryId = p.CategoryId,
                            Price = p.Price,
                            ImageUrl = p.ImageUrl,
                            Discount = p.Discount,
                            UserId = p.UserId,
                            Stock = p.Stock,
                            Status = p.Status,
                            TotalPurchased = g.TotalQuantity
                        })
                    .OrderByDescending(p => p.TotalPurchased);

                // Áp dụng lọc bổ sung (nếu cần)
                if (!string.IsNullOrEmpty(name))
                {
                    bestSellingQuery = (IOrderedQueryable<PlantDTOS>)bestSellingQuery.Where(p => p.PlantName.ToLower().Contains(name.ToLower()));
                }
                if (categoryId != null && categoryId.Count > 0)
                {
                    bestSellingQuery = (IOrderedQueryable<PlantDTOS>)bestSellingQuery.Where(p => categoryId.Contains(p.CategoryId));
                }               
                return bestSellingQuery.ToList();
            }

            // Các sắp xếp khác
            if (sortOption == 1)
            {
                query = query.OrderByDescending(p => p.CreateDate);
            }
            else if (sortOption == 3)
            {
                query = query.OrderBy(p => p.Price - (p.Price * (p.Discount / 100)));
            }
            else if (sortOption == 4)
            {
                query = query.OrderByDescending(p => p.Price - (p.Price * (p.Discount / 100)));
            }
          
            return query.Select(p => new PlantDTOS
            {
                PlantId = p.PlantId,
                PlantName = p.PlantName,
                CategoryId = p.CategoryId,
                Price = p.Price,
                ImageUrl = p.ImageUrl,
                Discount = p.Discount,
                UserId = p.UserId,
                Stock = p.Stock,
                Status = p.Status,
                TotalPurchased = 0 // Không có dữ liệu bán
            }).ToList();
        }     
    }
}
