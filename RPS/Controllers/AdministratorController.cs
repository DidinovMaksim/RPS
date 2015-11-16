﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RPS.Controllers
{
    public class AdministratorController : Controller
    {
        // GET: Administrator

        [Authorize(Roles = "Administrator")]
        public ActionResult Administrator()
        {
            return View();
        }
    }
}