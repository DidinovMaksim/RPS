﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using RPS.Models;
using WebMatrix.WebData;
using System.Web.Security;
using System.Web.Mvc;
using System.Data.Entity;

using Newtonsoft.Json;

namespace RPS.Services
{
    public class AdministratorServices
    {
        public static void EditUser(User user_, string userRole, string userPassword)
        {
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                User User = (from user in db.User where user.id == user_.id select user).First();
                if (User!= null)
                {
                    Roles.RemoveUserFromRole(user_.Login, User.webpages_Roles.First().RoleName);
                    Roles.AddUserToRole(user_.Login, userRole);
                    
                    if (userPassword.Length >0)
                    {
                        
                        MembershipUser mu = Membership.GetUser(user_.Login);
                        mu.UnlockUser();
                        mu.ChangePassword(mu.ResetPassword(), userPassword);
                        
                    }
                    User.MPhone = user_.MPhone;
                    User.Email = user_.Email;
                    User.UserFN = user_.UserFN;
                    User.UserLN = user_.UserLN;
                    User.Birthday = user_.Birthday;
                    User.IsActive = user_.IsActive;

                    db.SaveChanges();
                }
            }
        }
        public static void AddCustomer(User user_, string userPassword)
        {
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                //WebSecurity.CreateUserAndAccount(user_.Login, userPassword);
                //Roles.AddUserToRole(user_.Login, userRole);

                //var User = (from user in db.User where user.Login == user_.Login select user).First();
                db.User.Add(new User
                {
                    MPhone = user_.MPhone,
                    Email = user_.Email,
                    UserFN = user_.UserFN,
                    UserLN = user_.UserLN,
                    Birthday = user_.Birthday,
                    IsActive = user_.IsActive
                });
                db.SaveChanges();
            }
        }
        public static void AddUser(User user_,string userRole, string userPassword)
        {
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                //WebSecurity.CreateUserAndAccount(user_.Login, userPassword);
                //Roles.AddUserToRole(user_.Login, userRole);

                //var User = (from user in db.User where user.Login == user_.Login select user).First();
                db.User.Add(new User
                {
                    MPhone = user_.MPhone,
                    Email = user_.Email,
                    UserFN = user_.UserFN,
                    UserLN = user_.UserLN,
                    Birthday = user_.Birthday,
                    IsActive = user_.IsActive
                });
                db.SaveChanges();
            }
        }
        public static void DeleteCustomer(User user)
        {
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                db.User.Remove(db.User.Find(user.id));
                db.SaveChanges();
            }
        }
        public static object GetUser(int id)
        {
            object EUser;
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                User user = (from User in db.User where User.id == id select User).First();
                EUser = new
                {
                    id = user.id,
                    Login = user.Login,
                    UserFN = user.UserFN,
                    UserLN = user.UserLN,
                    MPhone = user.MPhone,
                    Email = user.Email,
                    Birthday = user.Birthday,
                    IsActive = user.IsActive
                };
            }
            return EUser;
        }
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
                                 id = user.id,
                                 UserFN = user.UserFN,
                                 UserLN = user.UserLN,
                                 Email = user.Email,
                                 MPhone = user.MPhone,
                                 Login = user.Login,
                                 Birthday = user.Birthday,
                                 IsActive = user.IsActive,
                                 Role = user.webpages_Roles.First().RoleName
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
                                 id = user.id,
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