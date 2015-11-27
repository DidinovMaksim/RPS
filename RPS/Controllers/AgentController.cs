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
    public class AgentController : Controller
    {
        DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities();
        // GET: Agent
        [Authorize(Roles = "Agent")]
        public ActionResult Index()
        {
            return View();
            
        }
        [HttpGet]
        public string getGridData()
        //public string getGridData(int page, int rows, string sidx, string sord)
        {

            /*return JsonConvert.SerializeObject(db.User.ToList(), Formatting.Indented, 
                new JsonSerializerSettings
                {ReferenceLoopHandling = ReferenceLoopHandling.Serialize});*/

            int id = (from users in db.User where users.Login == User.Identity.Name select users).ToList()[0].id;

            List<Call> calls = (from call in db.Call where call.Agent == id && call.Status == 1 select call).ToList();

            /*
            Int32 totalRows = db.Call.Count();
            Int32 totalPages = (int)Math.Ceiling(totalRows / (double)rows);
            List<Call> calls =  db.Call.Where(c => c.Agent == id && c.Status == 1).Skip((page - 1) * rows).Take(rows).ToList();
            */

            return JsonConvert.SerializeObject(calls, Formatting.None,
                        new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        });

            //return JsonConvert.SerializeObject(db.User.ToList());
        }

        public string EditGridData(Call call)
        {
            db.Call.Attach(call);
            db.Entry(call).State = EntityState.Modified;
            db.SaveChanges();
            return "Edited";
        }

        public string DeleteGridData(Call call)
        {
            db.Call.Remove(db.Call.Find(call.id));
            db.SaveChanges();
            return "Deleted";
        }
        public string ReplyCall([Bind(Exclude = "id")] Call call)
        {
            db.Call.Add(call);
            db.SaveChanges();
            return "added";
        }


    }
}