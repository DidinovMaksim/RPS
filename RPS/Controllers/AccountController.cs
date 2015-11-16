using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using RPS.Models;
using WebMatrix.WebData;

namespace RPS.Controllers
{
    public class AccountController : Controller
    {
        [HttpGet]
        public ActionResult Login()
        {
            return View();

        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public  ActionResult Login(Login logindata)
        {
            if(ModelState.IsValid)
            {
                if (WebSecurity.Login(logindata.Username, logindata.Password, logindata.RememberMe))
                    return RedirectToAction("Index", "Home");
                

            }
            ModelState.AddModelError("", "Wrong account or password. Try again!");
            return View(logindata);
        }
        public ActionResult Logout()
        {
            WebSecurity.Logout();
            return RedirectToAction("Index", "Home");
        }
    }
}