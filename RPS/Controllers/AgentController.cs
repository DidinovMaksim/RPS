using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using RPS.Models;
using Newtonsoft.Json;

namespace RPS.Controllers
{
    public class AgentController : Controller
    {
        // GET: Agent
        private DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities();
        [Authorize(Roles = "Agent")]
        public ActionResult Agent()
        {
            return View(db.User.ToList());
        }
        [HttpGet]
        public string getGridData()
        {
            return JsonConvert.SerializeObject(db.User.ToList());

        }
        /*class A
        {
            public int id { get; set; }
            public string Name { get; set; }
            public string Age { get; set; }
        }
        [HttpGet]
        public string getGridData()
        {
            List<A> assocArray = new List<A>();

            assocArray.Add(new A { id = 1, Name = "Jhon", Age = "20" });
            assocArray.Add(new A { id = 2, Name = "Mike", Age = "21" });
            string res = JsonConvert.SerializeObject(assocArray);
            return res;
        }*/
       

    }
}