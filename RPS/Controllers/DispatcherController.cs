using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RPS.Controllers
{
    public class DispatcherController : Controller
    {
        // GET: Dispatcher
        [Authorize(Roles = "Dispatcher")]
        public ActionResult Index()
        {
            return View();
        }
    }
}