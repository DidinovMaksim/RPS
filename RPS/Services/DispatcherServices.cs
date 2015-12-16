using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using RPS.Models;
using System.Web.Mvc;
using System.Data.Entity;

namespace RPS.Services
{
    public class DispatcherServices
    {

        public static object GetCallInfo(int id)
        {
            object callInfo = null;

            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                var TcallInfo = from call in db.Call
                           where call.id == id
                           select new
                           {
                               CustomerFN = call.User1.UserFN,
                               CustomerLN = call.User1.UserLN,
                               Email = call.User1.Email,
                               Phone = call.User1.MPhone,
                               CallText = call.CallText
                           };

                callInfo = TcallInfo.First();
                

            }

            return callInfo;
        }

        public static List<object> GetCustomers(string term)
        {
            List<object> customers = new List<object>();
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
               List<User> ex = (from user in db.User where user.webpages_Roles.Count != 0 select user).ToList();

                var list = from user in ex
                           where (user.webpages_Roles.ToList()[0].RoleName == "Customer")
                           && ( (user.UserFN.ToString() + " " + user.UserLN.ToString()).Contains(term) )
                           select new
                           {
                               value = user.id,
                               label = user.UserFN.ToString() + " " + user.UserLN.ToString() 
                           }; 

                foreach (var call in list)
                    customers.Add(call);
            }
            return customers;
        }

        public static List<SelectListItem> GetAgents()
        {
            List<SelectListItem> agents = new List<SelectListItem>();
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                agents.Add(new SelectListItem { Value = null, Text = "" });
                List<User> us = (from user in db.User where user.webpages_Roles.Count != 0 select user).ToList();

                var Tagents = from user in us
                             where user.webpages_Roles.ToList()[0].RoleId == 3
                             select new SelectListItem()
                             {
                                 Value = user.id.ToString(),
                                 Text = user.UserLN.ToString() + " " + user.UserFN.ToString()
                             };

                foreach (var call in Tagents)
                    agents.Add(call);
            }
            return agents;
        }

        public static int? GetAgentIdByCall(int callId)
        {
    
            int? id = null;
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                var agIdList = from call in db.Call where call.id == callId select new { agentId = call.Agent };
                int? agId = agIdList.First().agentId;
                if (agId != null) id = Int32.Parse(agId.ToString());
            }

            return id;
        }

        public static List<object> GetActiveCalls()
        {
            List<object> calls = new List<object>();
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                var Tcalls = from call in db.Call
                        where call.Status == 1
                        select new
                        {
                            id = call.id,
                            CallStatus = call.CallStatus.Status,
                            DateCreated = call.DateCreated,
                            AgentFN = call.User.UserFN,
                            AgentLN = call.User.UserLN,
                            CustomerFN = call.User1.UserFN,
                            CustomerLN = call.User1.UserLN
                        };

                
                foreach (var call in Tcalls)
                    calls.Add(call);
                

                
            }
            return calls;
        }

        public static void AttachAgent(int id, int? Agent)
        {
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                var upd = from call in db.Call where call.id == id select call;
                upd.ToList()[0].Agent = Agent;
                db.SaveChanges();
            }
        }

        public static bool AddCall(Call call)
        {
            bool result = true;
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                try
                {
                    db.Call.Add(call);
                    db.SaveChanges();
                }
                catch(Exception)
                {
                    result = false;
                }
            }
            return result;

        }

        public static void EditData(Call call)
        {
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                db.Call.Attach(call);
                db.Entry(call).State = EntityState.Modified;
                db.SaveChanges();
            }
        }

        public static void DeleteCall(Call call)
        {
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                db.Call.Remove(db.Call.Find(call.id));
                db.SaveChanges();
            }
        }
    }
}