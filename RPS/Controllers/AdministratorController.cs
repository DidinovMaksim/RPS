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
        public string getGridData()
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

        [HttpGet]
        public PartialViewResult EditUser(string id)
        {
            return PartialView(new UserValidation());
        }

        [HttpPost]
        public JsonResult EditUser(UserValidation user, string role)
        {
            user.EditUser();
            return Json(new
            {
                State = "Call replied successfully!"
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetUser(int id)
        {
            object EUser;
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                User user = (from User in db.User where User.id == id select User).ToList()[0];
                EUser = new
                {
                    UserFN = user.UserFN,
                    UserLN = user.UserLN,
                    MPhone = user.MPhone,
                    Email = user.Email,

                };
            }
            return Json(EUser, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public PartialViewResult AddUser()
        {
            GetRoles();
            return PartialView(new UserValidation());
        }

        [HttpPost]
        public string AddUser(UserValidation user, string userRole)
        {
            try
            {
                user.AddUser();
            }
            catch (Exception)
            {
                return "<p>Error</p>";
            }
            return "<p>Succes</p>";
        }
    }
}