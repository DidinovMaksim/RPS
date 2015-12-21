using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using RPS.Models;
using WebMatrix.WebData;
using System.Web.Security;

namespace RPS.Controllers
{
    /// <summary>
    /// Класс-контроллер для работе с  учетной записью пользователя
    /// </summary>
    public class AccountController : Controller
    {
        /// <summary>
        /// Представление
        /// </summary>
        /// <returns>Вовзращает представление</returns>
        [HttpGet]
        public ActionResult Login()
        {
            return View();
        }
        /// <summary>
        /// Авторизация польователя
        /// </summary>
        /// <param name="logindata">Вовзращает сообщение об ошибке, либо переадресует авторизованного пользователя</param>
        /// <returns></returns>
        [HttpPost]
        [ValidateAntiForgeryToken]
        public  ActionResult Login(Login logindata)
        {
            if(ModelState.IsValid)
            {
                if (WebSecurity.Login(logindata.Username, logindata.Password, logindata.RememberMe))
                {
                    string role = Roles.GetRolesForUser(logindata.Username).First();
                    switch(role)
                    {
                        case "Archivist": return RedirectToAction("Index", "Archivist");
                        case "Admin": return RedirectToAction("Administrator_Users", "Admin");
                        case "Agent": return RedirectToAction("Index", "Agent");
                        case "Dispatcher": return RedirectToAction("Index", "Dispatcher");
                    }
                    return RedirectToAction("Index", "Home");
                }
                

            }
            ModelState.AddModelError("", "Wrong account or password. Try again!");
            return View(logindata);
        }
        /// <summary>
        /// Метод выхода из учетной записи
        /// </summary>
        /// <returns>Вовзращает представление главной страницы</returns>
        public ActionResult Logout()
        {
            WebSecurity.Logout();
            return RedirectToAction("Index", "Home");
        }
    }
}