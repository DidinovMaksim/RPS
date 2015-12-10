using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using RPS.Models;
using RPS.ValidationModels;
using Newtonsoft.Json;
using RPS.Services;
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


            List<object> calls = AgentServices.GetCalls();

            /*
            Int32 totalRows = db.Call.Count();
            Int32 totalPages = (int)Math.Ceiling(totalRows / (double)rows);
            List<Call> calls =  db.Call.Where(c => c.Agent == id && c.Status == 1).Skip((page - 1) * rows).Take(rows).ToList();
            */

            /*return JsonConvert.SerializeObject(calls, Formatting.None,
                        new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        });*/

            return JsonConvert.SerializeObject(calls);
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
        [HttpGet]
        public PartialViewResult _ReplyCall(String id)
        {
            return PartialView(new CallValidation());
        }
        [HttpPost]
        public JsonResult _ReplyCall(CallValidation call)
        {
            call.AddAnswer();
            //return Json(new CallValidation());
            return Json(new
            {
                State = "Call replied successfully!"
            }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetCall(int id)
        {

            object RCall;
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                Call call = (from Call in db.Call where Call.id == id select Call).ToList()[0];
                RCall = new
                {
                    CallText = call.CallText,
                    DateCreated = call.DateCreated.ToLongDateString(),
                    UserFN = call.User1.UserFN,
                    UserLN = call.User1.UserLN

                };
            }
            return Json(RCall, JsonRequestBehavior.AllowGet);
        }
    }
}