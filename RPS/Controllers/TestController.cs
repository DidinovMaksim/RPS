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

            return "";
            return JsonConvert.SerializeObject(db.User.ToList(), Formatting.None,
                        new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        });

            /*var innerJoinQuery =
                from user in db.User
                join prod in products on category.ID equals prod.CategoryID
                select new { ProductName = prod.Name, Category = category.Name }; //produces flat sequence*/
                
           

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