﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DTO
{
    public class VerifyOtpRequestDto
    {
        public string RecipientEmail { get; set; }
        public string Otp { get; set; }
    }
}
