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

        public void AddUser()
        {
            DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities();
            db.User.Add(new User() {
                Login = this.Login,
                MPhone = this.MPhone,
                Email = this.Email,
                UserFN = this.UserFN,
                UserLN = this.UserLN,
                Birthday = this.Birthday,
                IsActive = this.IsActive
            });
            db.SaveChanges();
        }
        public void EditUser()
        {
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                var upd = from user in db.User where user.id == id select user;
                if (upd.ToList().Count > 0)
                {
                    upd.ToList()[0].MPhone = this.MPhone;
                    upd.ToList()[0].Email = this.Email;
                    upd.ToList()[0].UserFN = this.UserFN;
                    upd.ToList()[0].UserLN = this.UserLN;
                    upd.ToList()[0].IsActive = this.IsActive;
                    db.SaveChanges();
                }
            }
        }
    }
}