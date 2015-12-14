using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using RPS.Models;

namespace RPS.ValidationModels
{
    public class UserValidation
    {
        public int id { get; set; }
        public string Login { get; set; }
        public string MPhone { get; set; }
        public string Email { get; set; }
        public string UserFN { get; set; }
        public string UserLN { get; set; }
        public Nullable<System.DateTime> Birthday { get; set; }
        public bool IsActive { get; set; }
    }
}