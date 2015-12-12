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


            List<object> calls = AgentServices.GetCalls();

            /*
            Int32 totalRows = db.Call.Count();
            Int32 totalPages = (int)Math.Ceiling(totalRows / (double)rows);
            List<Call> calls =  db.Call.Where(c => c.Agent == id && c.Status == 1).Skip((page - 1) * rows).Take(rows).ToList();
            */


            return JsonConvert.SerializeObject(calls);
        }

        [HttpGet]
        public PartialViewResult _ReplyCall(String id)
        {
            return PartialView(new CallValidation());
        }
        [HttpPost]
        public JsonResult _ReplyCall(CallValidation call)
        {
            if (ValidateAnswer(call))
            {
                AgentServices.AddAnswer(new Call { id = call.id, Answer = call.Answer });
                return Json(new
                {
                    State = "Call replied successfully!"
                }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new
                {
                    State = "Call not replied! Try again!"
                }, JsonRequestBehavior.AllowGet);
        }
        bool ValidateAnswer(CallValidation call)
        {
            if (call.Answer != "" && call.Answer != null && call.id != 0) return true;
            else return false;
        }
        public JsonResult GetCall(int id)
        {

            object RCall = AgentServices.GetCall(id);
            return Json(RCall, JsonRequestBehavior.AllowGet);
        }
    }
}