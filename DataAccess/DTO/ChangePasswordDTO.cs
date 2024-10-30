using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.DTO
{
    public class ChangePasswordDTO
    {
        public int Id { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
    public class ChangePassword_EmailDTO
    {
        public string Email { get; set; }
        public string NewPassword { get; set; }
    }
}
