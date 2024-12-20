﻿using BusinessObject.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Net.payOS;
using Repositories.Implements;
using Repositories.Interface;
using Repositories.Service;
using System.Text;
using Web_API_OPMS.Controllers;

namespace Web_API_OPMS
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);


            builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
            // PayOS configuration
            PayOS payOS = new PayOS(builder.Configuration["Environment:PAYOS_CLIENT_ID"] ?? throw new Exception("Cannot find environment"),
                                    builder.Configuration["Environment:PAYOS_API_KEY"] ?? throw new Exception("Cannot find environment"),
                                    builder.Configuration["Environment:PAYOS_CHECKSUM_KEY"] ?? throw new Exception("Cannot find environment"));

            builder.Services.AddSingleton(payOS);

            // Configure Database Connection
            builder.Services.AddDbContext<Db6213Context>(options =>
                    options.UseSqlServer(builder.Configuration.GetConnectionString("OPMSConnection")));

            // Add JWT Authentication
            var key = Encoding.ASCII.GetBytes(builder.Configuration["JwtConfig:Secret"]);
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
            })
             .AddCookie()
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,  // Set to 'true' and configure issuer in a production app
                    ValidateAudience = false // Set to 'true' and configure audience in a production app
                };
            })
            // Add Google Authentication
            .AddGoogle(options =>
            {
                options.ClientId = builder.Configuration["Google:ClientId"];
                options.ClientSecret = builder.Configuration["Google:ClientSecret"];
                options.SaveTokens = true;
            });

            // CORS Policy to allow all origins
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigins", builder =>
                {
                    builder
                    //.WithOrigins("https://clientfe.runasp.net/") // Cho phép nguồn frontend của bạn
                    .AllowAnyOrigin() // Cho phép mọi nguồn
                    .AllowAnyHeader()
                   .AllowAnyMethod();
                   //.AllowCredentials(); // Cho phép gửi thông tin xác thực
                });
            });

            // Session Configuration
            builder.Services.AddDistributedMemoryCache();
            builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30); // Set your session timeout
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });

            builder.Services.AddControllers();

            // Swagger for API documentation
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            // Register OrderAPI with Dependency Injection
            builder.Services.AddScoped<OrderAPI>();
            // Đăng ký IReviewRepository với implement là ReviewRepository
            builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
            // Đăng ký IVoucherRepository với implement là VoucherRepository
            builder.Services.AddScoped<IVoucherRepository, VoucherRepository>();
            builder.Services.AddScoped<IPostRepository, PostRepository>();
            builder.Services.AddScoped<ICommentRepository, CommentRepository>();
            builder.Services.AddScoped<IFeedbackRepository, FeedbackRepository>();
            builder.Services.AddScoped<IReplyCommentRepository, ReplyCommentRepository>();
            builder.Services.AddSingleton<IGeographyRepository, GeographyRepository>();
            builder.Services.AddTransient<MailService>();
            var app = builder.Build();
            
            app.UseSwagger();
            // Enable Swagger UI in development mode
            if (app.Environment.IsDevelopment())
            {
                
                app.UseSwaggerUI();
            }
            // Enable CORS policy
            app.UseCors("AllowAllOrigins");
            app.UseHttpsRedirection();

            // Enable session management
            app.UseSession();

            // Enable authentication and authorization
            app.UseAuthentication();
            app.UseAuthorization();
          
            // Map controllers to endpoints
            app.MapControllers();

            // Run the app
            app.Run();
        }
    }
}
