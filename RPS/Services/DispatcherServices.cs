using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using RPS.Models;
using System.Web.Mvc;

namespace RPS.Services
{
    public class DispatcherServices
    {
        public static object GetUser(int id)
        {
            object Usr;
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                User tmp = (from usr in db.User where usr.id == id select usr).ToList()[0];
                Usr = new
                {
                    UserFN = tmp.UserFN,
                    UserLN = tmp.UserLN
                };
            }

            return Usr;
        }

        //public static List<object> GetCalls()
        //{

        //    List<object> calls = new List<object>();
        //    using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
        //    {
        //        int id = GetAgentId();
        //        List<Call> Tcalls = (from call in db.Call where call.Agent == id && call.Status != 3 select call).ToList();
        //        foreach (Call tmp in Tcalls)
        //        {


        //            object newCall = new
        //            {
        //                id = tmp.id,
        //                CustomerName = tmp.User1.UserFN,
        //                CustomerSurname = tmp.User1.UserFN,

        //                DateCreated = tmp.DateCreated,
        //                Status = tmp.CallStatus.Status,
        //                DateSolved = tmp.DateSolved,

        //            };
        //            //newCall.User =  tmp.User;
        //            calls.Add(newCall);

        //        }
        //    }
        //    return calls;

        //}


        //public static List<Call> GetActiveCalls()
        //{
        //    List<Call> calls = new List<Call>();
        //    using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
        //    {

        //        List<Call> Tcalls = (from call in db.Call where call.Status == 1 select call).ToList();
        //        foreach (Call tmp in Tcalls)
        //        {
        //            tmp.CallStatus.Call.Clear();
        //            tmp.User.Call.Clear();
        //            tmp.User.Call1.Clear();
        //            tmp.User.webpages_Roles.Clear();

        //            tmp.User1.Call.Clear();
        //            tmp.User1.Call1.Clear();
        //            tmp.User1.webpages_Roles.Clear();

        //            calls.Add(tmp);

        //        }
        //    }
        //    return calls;
        //}

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

                callInfo = (TcallInfo.ToArray())[0];

            }

            return callInfo;
        }

        public static List<object> GetCustomers(string term)
        {
            List<object> customers = new List<object>();
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                var list = from user in db.User
                           where (user.webpages_Roles.Count == 0)
                           && (user.UserFN != null && user.UserFN.Contains(term))
                           select new { value = user.id, label = user.UserFN };

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
                             select new SelectListItem() { Value = user.id.ToString(), Text = user.UserLN };

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
                int? agId = agIdList.ToArray()[0].agentId;
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
    }
}