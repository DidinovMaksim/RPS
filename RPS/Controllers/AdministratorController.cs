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
    //класс для связи моделей и представлений
    public class AdministratorController : Controller
    {
        private DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities();

        [Authorize(Roles = "Administrator")]
        //возвращает представление для грида пользователей
        public ActionResult Administrator_Users()
        {
            return View();
        }
        //возвращает представление для грида кастомеров
        public ActionResult Administrator_Customers()
        {
            return View();
        }
        //заполняет грид юзерами
        [HttpGet]
        public string getGridDataUsers()
        {
            List<object> users = AdministratorServices.GetUsers();
            return JsonConvert.SerializeObject(users);
        }
        //заполняет грид кастомерами
        [HttpGet]
        public string getGridDataCustomers()
        {
            List<object> users = AdministratorServices.GetCustomers();
            return JsonConvert.SerializeObject(users);
        }
        //создает глобальный массив ролей
        public void GetRoles()
        {
            ViewData["RoleList"] = AdministratorServices.GetRoles();
        }
        //проверка логина
        public bool CheckLogin(string login)
        {
            if (WebSecurity.UserExists(login))
                return true;
            else
                return false;
        }
        //возращает одного юзера по id в представление
        public JsonResult GetUser(int id)
        {
            return Json(AdministratorServices.GetUser(id), JsonRequestBehavior.AllowGet);
        }
        //удаляет кастомеров
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
        //возвращает представление для формы добавления кастомеров
        [HttpGet]
        public PartialViewResult AddCustomer()
        {
            return PartialView(new UserValidation());
        }
        //возвращает представление для формы редактирования кастомеров
        [HttpGet]
        public PartialViewResult EditCustomer(String id)
        {
            return PartialView(new UserValidation());
        }
        //представление для редактирования пользователей
        [HttpGet]
        public PartialViewResult EditUser()
        {
            GetRoles();
            return PartialView(new UserValidation());
        }
        //редактирование пользователей
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
        //представление для добавления юзеров
        [HttpGet]
        public PartialViewResult AddUser()
        {
            GetRoles();
            return PartialView(new UserValidation());
        }
        //добавление кастомеров
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
        //добавление юзеров
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
