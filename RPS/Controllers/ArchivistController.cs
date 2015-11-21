using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RPS.Controllers
{
    public class ArchivistController : Controller
    {
        // GET: Archivist
        [Authorize(Roles = "Archivist")]
        public ActionResult Index()
        {
            return View();
        }
    }
}