using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using RPS.Models;
using Newtonsoft.Json;
using System.Data.Entity;

namespace RPS.Controllers
{
    public class TestController : Controller
    {

        private DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities();
        // GET: Test
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public string getGridData()
        {

            /*return JsonConvert.SerializeObject(db.User.ToList(), Formatting.Indented, 
                new JsonSerializerSettings
                {ReferenceLoopHandling = ReferenceLoopHandling.Serialize});*/


            return JsonConvert.SerializeObject(db.User.ToList(), Formatting.None,
                        new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        });

            //return JsonConvert.SerializeObject(db.User.ToList());

        }
        public string EditGridData(User usr)
        {
            db.User.Attach(usr);
            db.Entry(usr).State = EntityState.Modified;
            db.SaveChanges();
            return "Edited";
        }

        public string DeleteGridData(User usr)
        {
            db.User.Remove(db.User.Find(usr.id));
            db.SaveChanges();
            return "Deleted";
        }
        public string AddGridData([Bind(Exclude = "id")] User usr)
        {
            db.User.Add(usr);
            db.SaveChanges();
            return "added";
        }
    }
}