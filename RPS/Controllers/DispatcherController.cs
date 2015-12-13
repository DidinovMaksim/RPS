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
       // DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities();
        // GET: Dispatcher
        [Authorize(Roles = "Dispatcher")]
        public ActionResult Index()
        {
            return View();
        }

        public string getGridData()
        {
            
            return JsonConvert.SerializeObject(Services.DispatcherServices.GetActiveCalls(), Formatting.None,
                        new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        });
        }

        

        public string EditGridData(Call call)
        {
            Services.DispatcherServices.EditData(call);
            return "Edited";
        }

        public string DeleteGridData(Call call)
        {
            Services.DispatcherServices.DeleteCall(call);
            return "Deleted";
        }


        public string GetCustomersJSON(string term)
        {
            return JsonConvert.SerializeObject(Services.DispatcherServices.GetCustomers(term), Formatting.Indented,
                        new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        });
        }

        [HttpGet]
        public PartialViewResult AttachAgent(int id)
        {
            ViewData["AgentsList"] = Services.DispatcherServices.GetAgents();
            return PartialView(new CallValidation { Agent = Services.DispatcherServices.GetAgentIdByCall(id) });
        }

        [HttpPost]
        public string AttachAgent(int id, int? Agent)
        {
            Services.DispatcherServices.AttachAgent(id, Agent);
            return "<p>Succes</p>";
        }

        public PartialViewResult AddCall()
        {
            ViewData["AgentsList"] = Services.DispatcherServices.GetAgents();
            return PartialView(new CallValidation());
        }

        [HttpPost]
        public string AddCall(CallValidation call)
        {
            bool result = Services.DispatcherServices.AddCall(
                new Call {
                    Customer = call.Customer,
                    CallText = call.CallText,
                    Agent = call.Agent,
                    DateCreated = DateTime.Now,
                    Status = 1
                }
            );
        
            return result ? "Call added successfull" : "Error occured";
        }

        public PartialViewResult CallInfo()
        {
            return PartialView();
        }

        public string GetCallInfo(int id)
        {
            return JsonConvert.SerializeObject(Services.DispatcherServices.GetCallInfo(id), Formatting.Indented,
                        new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        });
        }


    }
}