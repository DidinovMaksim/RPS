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
    public class DispatcherController : Controller
    {
        DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities();
        // GET: Dispatcher
        [Authorize(Roles = "Dispatcher")]
        public ActionResult Index()
        {
            return View();
        }

        public string getGridData()
        {
            List<Call> calls = (from call in db.Call where call.Status == 1 select call).ToList();

            return JsonConvert.SerializeObject(calls, Formatting.None,
                        new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        });
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
        //public PartialViewResult _ReplyCall(CallValidation call)
        //{

        //    return PartialView(new CallValidation());

        //}
        //public ActionResult ReplyCall(CallValidation call)
        //{
        //    call.AddAnswer();
        //    return PartialView("_ReplyCall", new CallValidation());
        //}

        public string CreateCall(CallValidation call) => "";

        public string AttachCall(CallValidation call) => "";


    }
}