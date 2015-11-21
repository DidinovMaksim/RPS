using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace RPS.Controllers
{
    public class AgentController : Controller
    {
        // GET: Agent
        [Authorize(Roles = "Agent")]
        public ActionResult Index()
        {
            return View();
            
        }
        

    }
}