using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using RPS.Models;
using System.Web.Mvc;
using System.Data.Entity;

namespace RPS.Services
{
    public class AdministratorServices
    {
        public static List<object> GetUsers()
        {
            List<object> users = new List<object>();
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                List<User> us = (from user in db.User where user.webpages_Roles.Count != 0 select user).ToList();

                var Tusers = from user in us
                             where user.webpages_Roles.ToList()[0].RoleId != 5
                             select new
                             {
                                 UserFN = user.UserFN,
                                 UserLN = user.UserLN,
                                 MPhone = user.MPhone,
                                 Login = user.Login,
                                 Birthday = user.Birthday,
                                 IsActive = user.IsActive
                             };

                foreach (var call in Tusers)
                    users.Add(call);
            }
            return users;
        }
        public static List<object> GetCustomers()
        {
            List<object> users = new List<object>();
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                List<User> us = (from user in db.User where user.webpages_Roles.Count == 0 select user).ToList();

                var Tusers = from user in us
                             select new
                             {
                                 UserFN = user.UserFN,
                                 UserLN = user.UserLN,
                                 MPhone = user.MPhone,
                                 Login = user.Login,
                                 Birthday = user.Birthday,
                                 IsActive = user.IsActive
                             };

                foreach (var call in Tusers)
                    users.Add(call);
            }
            return users;
        }
        public static List<SelectListItem> GetRoles()
        {
            List<SelectListItem> roleList = new List<SelectListItem>();
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                List<webpages_Roles> webpagesRolesList = db.webpages_Roles.ToList();

                foreach (webpages_Roles role in webpagesRolesList)
                {
                    roleList.Add(new SelectListItem { Text = role.RoleName, Value = role.RoleName });
                }
            }
            return roleList;
        }
        public static List<object> GetCustomers(string term)
        {
            List<object> customers = new List<object>();
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                var list = from user in db.User
                           where (user.webpages_Roles.Count == 0)
                           && (user.UserFN != null && user.UserFN.Contains(term))
                           select new { value = user.id, label = user.UserFN };

                foreach (var call in list)
                    customers.Add(call);
            }
            return customers;
        }
    }
}