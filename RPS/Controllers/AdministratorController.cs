using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using RPS.Models;
using RPS.ValidationModels;
using System.Data.Entity;
using RPS.Services;
using WebMatrix.WebData;

namespace RPS.Controllers
{
    public class AdministratorController : Controller
    {
        private DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities();

        [Authorize(Roles = "Administrator")]
        public ActionResult Administrator_Users()
        {
            return View();
        }

        public ActionResult Administrator_Customers()
        {
            return View();
        }

        [HttpGet]
        public string getGridDataUsers()
        {
            
            List<object> users = AdministratorServices.GetUsers();
            return JsonConvert.SerializeObject(users);
        }

        [HttpGet]
        public string getGridDataCustomers()
        {
            List<object> users = AdministratorServices.GetCustomers();
            return JsonConvert.SerializeObject(users);
        }

        public void GetRoles()
        {
            ViewData["RoleList"] = AdministratorServices.GetRoles();
        }

        public bool CheckLogin(string login)
        {
            if (WebSecurity.UserExists(login))
                return true;
            else
                return false;
        }

        public JsonResult GetUser(int id)
        {
            return Json(AdministratorServices.GetUser(id), JsonRequestBehavior.AllowGet);
        }

        public JsonResult DeleteCustomer(UserValidation user)
        {
            if(AdministratorServices.DeleteCustomer(new User { id = user.id , Login = user.Login}))
            return Json(new
            {
                State = "User deleted successfully!"
            }, JsonRequestBehavior.AllowGet);
            else
                return Json(new
                {
                    State = "User not deleted! Please, delete all call attached to this customer first!"
                }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public PartialViewResult AddCustomer()
        {
            return PartialView(new UserValidation());
        }

        [HttpGet]
        public PartialViewResult EditCustomer(String id)
        {
            return PartialView(new UserValidation());
        }

        [HttpGet]
        public PartialViewResult EditUser()
        {
            GetRoles();
            return PartialView(new UserValidation());
        }

        [HttpPost]
        public JsonResult EditUser(UserValidation user, string userRole, string userPassword)
        {
            AdministratorServices.EditCustomer(new User
            {
                id = user.id,
                Login = user.Login,
                MPhone = user.MPhone,
                Email = user.Email,
                UserFN = user.UserFN,
                UserLN = user.UserLN,
                Birthday = user.Birthday,
                IsActive = user.IsActive
            });
            return Json(new
            {
                State = "User edited successfully!"
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public PartialViewResult AddUser()
        {
            GetRoles();
            return PartialView(new UserValidation());
        }

        [HttpPost]
        public JsonResult AddCustomer(UserValidation user)
        {
            try
            {
                if (!CheckLogin(user.Login))
                {
                    AdministratorServices.AddCustomer(new User
                    {
                        MPhone = user.MPhone,
                        Login = user.Login,
                        Email = user.Email,
                        UserFN = user.UserFN,
                        UserLN = user.UserLN,
                        Birthday = user.Birthday,
                        IsActive = user.IsActive
                    });
                    return Json(new
                    {
                        State = "Succes"
                    }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new
                    {
                        State = "Login is not unique!"
                    }, JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception ex)
            {
                return Json(new
                {
                    State = ex
                }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult AddUser(UserValidation user, string userRole, string userPassword)
        {
            try
            {
                if (!CheckLogin(user.Login))
                {
                    AdministratorServices.AddUser(new User
                    {
                        MPhone = user.MPhone,
                        Login = user.Login,
                        Email = user.Email,
                        UserFN = user.UserFN,
                        UserLN = user.UserLN,
                        Birthday = user.Birthday,
                        IsActive = user.IsActive
                    }, userRole, userPassword);
                    return Json(new
                    {
                        State = "User added succesfully!"
                    }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new
                    {
                        State = "Login is not unique!"
                    }, JsonRequestBehavior.AllowGet);
                }

            }
            catch (Exception ex)
            {
                return Json(new
                {
                    State = ex
                }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}