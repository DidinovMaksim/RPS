using RPS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using WebMatrix.WebData;

namespace RPS.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                return View();
            }
        }
        [Authorize(Roles ="Administrator")]
        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}