using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using RPS.Models;
using RPS.ValidationModels;
using Newtonsoft.Json;
using System.Data.Entity;

namespace RPS.Controllers
{

    public class ArchivistController : Controller
    {
        DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities();
        // GET: Dispatcher
        [Authorize(Roles = "Archivist")]
        public ActionResult Index()
        {
            return View();
        }

        public string getGridDataActive()
        {
            List<Call> calls = (from call in db.Call where call.Status == 1 select call).ToList();

            return JsonConvert.SerializeObject(calls, Formatting.None,
                        new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        });
        }

        public string getGridDataArchived()
        {
            List<Call> calls = (from call in db.Call where call.Status == 3 select call).ToList();

            return JsonConvert.SerializeObject(calls, Formatting.None,
                        new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        });
        }

        public string GetReasonsJSON(string term)
        {
            var list = from user in db.CallArchivedReason
                       where (user.Reason != null)
                       && (user.Reason.Contains(term))
                       select new { value = user.Reason, label = user.Reason };

            return JsonConvert.SerializeObject(list, Formatting.Indented,
                        new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        });
        }



        [HttpGet]
        public PartialViewResult ActiveCall(int id)
        {
            ViewData["AgentsList"] = Services.ArchivistServices.GetStatus();
            return PartialView(new CallValidation());
            //    return PartialView(new CallValidation { Agent = Services.ArchivistServices.GetAgentIdByCall(id) });
        }

        //[HttpPost]
        //public string ActiveCall(int id, int? Agent)
        //{
        //    Services.ArchivistServices.AttachAgent(id, Agent);
        //    return "<p>Succes</p>";
        //}

        public PartialViewResult ArchivedCall(String id)
        {
            return PartialView(new CallValidation());
        }
        public string AttachAgent(int? id, int? Agent, int? country)
        {
            if (id == null) return "<p>Error</p>";

            var upd = from call in db.Call where call.id == id select call;

            upd.ToList()[0].Agent = Agent;
            db.SaveChanges();

            return "<p>Succes</p>";
        }

        [HttpPost]
        public string ArchivedCall(int? id, string Reason)
        {
            if (id == null) return "<p>Error</p>";

            var upd = from call in db.Call where call.id == id select call;

            upd.ToList()[0].Reason = Reason;
            db.SaveChanges();

            return "<p>Succes</p>";
        }
    }
}