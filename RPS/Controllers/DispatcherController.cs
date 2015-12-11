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
            //List<Call> calls = (from call in db.Call where call.Status == 1 select call).ToList();

            return JsonConvert.SerializeObject(Services.DispatcherServices.GetActiveCalls(), Formatting.None,
                        new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        });
        }

        //public string getGridDataFast()
        //{
        //    return JsonConvert.SerializeObject(Services.DispatcherServices.GetActiveCallsFast(), Formatting.None,
        //                new JsonSerializerSettings()
        //                {
        //                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
        //                });
        //}



        public string EditGridData(Call call)
        {
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                db.Call.Attach(call);
                db.Entry(call).State = EntityState.Modified;
                db.SaveChanges();
            }
            return "Edited";
        }

        public string DeleteGridData(Call call)
        {
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                 db.Call.Remove(db.Call.Find(call.id));
                 db.SaveChanges();
            }
            return "Deleted";
        }

        //public string GetAgentsList()
        //{
        //    List<User> us = (from user in db.User where user.webpages_Roles.Count != 0 select user).ToList();
        //    List<User> agents = (from user in us where user.webpages_Roles.ToList()[0].RoleId == 3 select user).ToList();

        //    return JsonConvert.SerializeObject(agents, Formatting.Indented,
        //                new JsonSerializerSettings()
        //                {
        //                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
        //                });
        //}

        //public string GetDict()
        //{
        //    List<User> us = (from user in db.User where user.webpages_Roles.Count != 0 select user).ToList();
        //    List<User> agents = (from user in us where user.webpages_Roles.ToList()[0].RoleId == 3 select user).ToList();

        //    List<KeyValuePair<int, string>> list = new List<KeyValuePair<int, string>>();

        //    foreach (var agent in agents)
        //        list.Add(new KeyValuePair<int, string>(agent.id, agent.UserFN));


        //    return JsonConvert.SerializeObject(list, Formatting.Indented,
        //                new JsonSerializerSettings()
        //                {
        //                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
        //                });
        //}

        public string GetCustomersJSON(string term)
        {
            return JsonConvert.SerializeObject(Services.DispatcherServices.GetCustomers(term), Formatting.Indented,
                        new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        });
        }

        //public string GetAgentsJSON(string term)
        //{
        //    List<User> us = (from user in db.User where user.webpages_Roles.Count != 0 select user).ToList();

           
        //    var list = from user in us
        //               where (user.webpages_Roles.ToList()[0].RoleId == 3)
        //               && (user.UserFN != null && user.UserFN.Contains(term))
        //               select new { value = user.id, label = user.UserFN };

        //    return JsonConvert.SerializeObject(list, Formatting.Indented,
        //                new JsonSerializerSettings()
        //                {
        //                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
        //                });
        //}


        //public string D(string term)
        //{
        //    var list = from user in db.User
        //               where user.UserFN != null && user.UserFN.Contains(term)
        //               select new { value = user.id, label = user.UserFN };

        //    return JsonConvert.SerializeObject(list, Formatting.Indented,
        //                new JsonSerializerSettings()
        //                {
        //                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
        //                });
            
        //}

        //public IEnumerable<SelectListItem> GetAgents()
        //{
        //    List<User> us = (from user in db.User where user.webpages_Roles.Count != 0 select user).ToList();
           
        //    var agents = from user in us
        //            where user.webpages_Roles.ToList()[0].RoleId == 3
        //            select new SelectListItem() { Value = user.id.ToString(), Text = user.UserFN  };

        //    return agents;
        //}

        //public IEnumerable<SelectListItem> GetCustomers()
        //{
        //    var customers = from user in db.User
        //                    where user.webpages_Roles.Count == 0
        //                    select new SelectListItem() { Value = user.id.ToString(), Text = user.UserFN };

        //    return customers;
        //}

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
            ViewData["AgentsList"]      = Services.DispatcherServices.GetAgents();
            //ViewData["CustomerList"] = GetCustomers();
            return PartialView(new CallValidation());
        }

        [HttpPost]
        public string AddCall(CallValidation call)
        {
            try
            {
                call.AddCall();
            }
            catch(Exception)
            {
                return "<p>Error</p>";
            }
            return "<p>Succes</p>";
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