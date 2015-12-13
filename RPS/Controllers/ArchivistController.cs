using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using RPS.Models;
using RPS.ValidationModels;
using Newtonsoft.Json;
using System.Data.Entity;

using RPS.Services;

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
            List<object> calls = ArchivistServices.GetCallsNotArchived();

            return JsonConvert.SerializeObject(calls);
        }

        public string getGridDataArchived()
        {
            List<object> calls = ArchivistServices.GetCallsArchived();

            return JsonConvert.SerializeObject(calls);
        }

        public string GetReasonsJSON(string term)
        {         
            return JsonConvert.SerializeObject(ArchivistServices.GetReasons(term));
        }
        [HttpGet]
        public PartialViewResult ArchiveCall(String id)
        {
            return PartialView(new CallValidation());
        }


        [HttpPost]
        public JsonResult ArchiveCall(CallValidation call)
        {
            if (ValidateArchive(call))
            {
                ArchivistServices.ArchiveCall(new Call() { id = call.id, Reason = call.Reason });
                return Json(new
                {
                    State = "Call archived successfully!"
                }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new
                {
                    State = "Call not archived! Try again!"
                }, JsonRequestBehavior.AllowGet);


        }
        [HttpGet]
        public PartialViewResult ActivateCall(String id)
        {
            ViewData["StatusList"] = ArchivistServices.GetStatusList();
            return PartialView(new CallValidation());
        }


        [HttpPost]
        public JsonResult ActivateCall(CallValidation call, int Status)
        {
            if (ValidateArchive(call) && (Status == 1 || Status == 2))
            {
                ArchivistServices.ActivateCall(new Call() { id = call.id, Reason = call.Reason }, Status);
                return Json(new
                {
                    State = "Call activated successfully!"
                }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new
                {
                    State = "Call not activated! Try again!"
                }, JsonRequestBehavior.AllowGet);


        }
        bool ValidateArchive(CallValidation call)
        {
            if (call.id != 0 && call.Reason != null && call.Reason != "") return true;
            else return false;
        }


        public JsonResult GetCall(int id)
        {

            object RCall = ArchivistServices.GetCall(id);
            return Json(RCall, JsonRequestBehavior.AllowGet);
        }
        



    }
}