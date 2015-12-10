using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using RPS.Models;

using System.Web.Mvc;
using System.Data.Entity;


namespace RPS.Services
{
    public class AgentServices
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
        //public static object GetCalls()
        //{

        //    //List<object> calls = new List<object>();

        //    object calls = new object();

        //    using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
        //    {
        //        var callss = from call in db.Call
        //                     where call.Status != 3
        //                     select new
        //                     {
        //                         id = call.id,
        //                         CallText = call.CallText,
        //                         DateCreated = call.DateCreated,
        //                         Status = call.CallStatus.Status,
        //                         DateSolved = call.DateSolved,
        //                         CustomerName = call.User1.UserFN,
        //                         CustomerSurname = call.User1.UserLN

        //                     };



        //    }
        //    return calls;

        //}

        public static List<object> GetCalls()
        {

            List<object> calls = new List<object>();
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                int id = GetAgentId();
                List<Call> Tcalls = (from call in db.Call where call.Agent == id && call.Status != 3 select call).ToList();
                foreach (Call tmp in Tcalls)
                {
                    /*calls.Add(new Call()
                    {
                        id = tmp.id,

                    });*/

                    /*tmp.CallStatus.Call.Clear();
                    tmp.User.Call.Clear();
                    tmp.User.Call1.Clear();
                    tmp.User.webpages_Roles.Clear();

                    tmp.User1.Call.Clear();
                    tmp.User1.Call1.Clear();
                    tmp.User1.webpages_Roles.Clear();

                    calls.Add(tmp);*/

                    object newCall = new 
                    {
                        id = tmp.id,
                        CustomerName = tmp.User1.UserFN,
                        CustomerSurname = tmp.User1.UserFN,
                        
                        DateCreated = tmp.DateCreated,
                        Status = tmp.CallStatus.Status,
                        DateSolved = tmp.DateSolved,

                    };
                    //newCall.User =  tmp.User;
                    calls.Add(newCall);

                }
            }
            return calls;

        }

        //public static List<Call> GetCalls()
        //{

        //    List<Call> calls = new List<Call>();
        //    using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
        //    {
        //        int id = GetAgentId();
        //        List<Call> Tcalls = (from call in db.Call where call.Agent == id && call.Status != 3 select call).ToList();
        //        foreach (Call tmp in Tcalls)
        //        {
        //            /*calls.Add(new Call()
        //            {
        //                id = tmp.id,

        //            });*/

        //            /*tmp.CallStatus.Call.Clear();
        //            tmp.User.Call.Clear();
        //            tmp.User.Call1.Clear();
        //            tmp.User.webpages_Roles.Clear();

        //            tmp.User1.Call.Clear();
        //            tmp.User1.Call1.Clear();
        //            tmp.User1.webpages_Roles.Clear();

        //            calls.Add(tmp);*/

        //            Call newCall = new Call()
        //            {
        //                id = tmp.id,
        //                Customer = tmp.Customer,
        //                Agent = tmp.Agent,
        //                CallText = tmp.CallText,
        //                DateCreated = tmp.DateCreated,
        //                Status = tmp.Status,
        //                DateSolved = tmp.DateSolved,
        //                DateArchived = tmp.DateArchived,
        //                Reason = tmp.Reason,
        //                IsDeleted = tmp.IsDeleted


        //            };
        //            //newCall.User =  tmp.User;
        //            calls.Add(newCall);

        //        }
        //    }
        //    return calls;

        //}
        static int GetAgentId()
        {
            string userName = HttpContext.Current.User.Identity.Name;
            int id;
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                id = (from users in db.User where users.Login == userName select users).ToList()[0].id;
            }
                
            return id;
        }
        public static List<Call> GetActiveCalls()
        {
            List<Call> calls = new List<Call>();
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                int id = GetAgentId();
                List<Call> Tcalls = (from call in db.Call where call.Agent == id && call.Status == 1 select call).ToList();
                foreach(Call tmp in Tcalls)
                {
                    /*calls.Add(new Call()
                    {
                        id = tmp.id,

                    });*/

                    tmp.CallStatus.Call.Clear();
                    tmp.User.Call.Clear();
                    tmp.User.Call1.Clear();
                    tmp.User.webpages_Roles.Clear();

                    tmp.User1.Call.Clear();
                    tmp.User1.Call1.Clear();
                    tmp.User1.webpages_Roles.Clear();

                    calls.Add(tmp);

                    /*Call newCall = new Call()
                    {
                        id = tmp.id,
                        Customer = tmp.Customer,
                        Agent = tmp.Agent,
                        CallText = tmp.CallText,
                        DateCreated = tmp.DateCreated,
                        Status = tmp.Status,
                        DateSolved = tmp.DateSolved,
                        DateArchived = tmp.DateArchived,
                        Reason = tmp.Reason,
                        IsDeleted = tmp.IsDeleted


                    };
                    newCall.User =  tmp.User;
                    calls.Add(newCall);*/

                }
            }
            return calls;
        }
        public static List<Call> GetClosedCalls()
        {
            List<Call> calls;
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                int id = GetAgentId();
                calls = (from call in db.Call where call.Agent == id && call.Status == 2 select call).ToList();
            }
            return calls;
        }

    }
}