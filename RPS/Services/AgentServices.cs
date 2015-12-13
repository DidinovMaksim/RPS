using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using RPS.Models;

using System.Web.Mvc;
using System.Data.Entity;

using Newtonsoft.Json;

namespace RPS.Services
{
    public class AgentServices
    {
        public static object GetUser(int id)
        {
            object Usr;
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                User tmp = (from usr in db.User where usr.id == id select usr).First();
                Usr = new 
                {
                    CustomerName = tmp.UserLN.ToString() + " " + tmp.UserFN.ToString(),
                };
            }

            return Usr;
        }
        public static void AddAnswer(Call Call)
        {
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                var upd = (from call in db.Call where call.id == Call.id select call).First();
                upd.Answer = Call.Answer;
                upd.Status = 2;
                upd.DateSolved = DateTime.Now;
                db.SaveChanges();
            }

        }
        static public object GetCall(int id)
        {
            object RCall = new object();
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                var call = (from Call in db.Call where Call.id == id select Call).First();
                RCall = new
                {
                    CallText = call.CallText,
                    DateCreated = call.DateCreated.ToLongDateString(),
                    CustomerName = call.User1.UserLN.ToString() + " " + call.User1.UserFN.ToString(),
                    Answer = call.Answer
                };
            }
            return RCall;
        }

        public static List<object> GetCalls()
        {

            List<object> calls = new List<object>();
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {

                int id = GetAgentId();
                var TCalls = from call in db.Call
                         where call.Agent == id && call.Status != 3
                         select new
                         {
                             id = call.id,
                             CustomerName = call.User1.UserLN.ToString() + " " + call.User1.UserFN.ToString(),
                             

                             DateCreated = call.DateCreated,
                             Status = call.CallStatus.Status,
                             DateSolved = call.DateSolved,
                         };
                foreach(var tmp in TCalls)
                {
                    calls.Add(tmp);
                }

               
            }
            return calls;

        }

        static int GetAgentId()
        {
            string userName = HttpContext.Current.User.Identity.Name;
            int id;
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                id = (from users in db.User where users.Login == userName select users).First().id;
            }
                
            return id;
        }
       

    }
}