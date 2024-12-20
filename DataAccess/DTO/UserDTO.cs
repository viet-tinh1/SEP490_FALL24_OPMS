﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DTO
{
    public class UserDTO
    {
        public int UserId { get; set; }

        public string Username { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string? PhoneNumber { get; set; }

        public int Roles { get; set; }

        public string? FullName { get; set; }

        public string? Address { get; set; }


        public string? UserImage { get; set; }

        public int? Status { get; set; }
        public string? ShopName { get; set; }
    }

}
