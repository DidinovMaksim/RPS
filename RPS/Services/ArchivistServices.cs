using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using RPS.Models;
using System.Web.Mvc;

namespace RPS.Services
{
/// <summary>
    /// Клас з сервісами для бази даних для сторінки архівіста
    /// </summary>

    public class ArchivistServices
    {

        /// <summary>
        /// Метод для отримання статусу запиту
        /// </summary>
        /// <returns>Об'єкт з інформацією про статус запиту</returns>
        public static List<object> GetStatus()
        {
            List<object> status = new List<object>();
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                var Tstatus = from call in db.CallStatus
                              select new
                              {
                                  CallStatus = call.Status,
                              };


                foreach (var sstatus in Tstatus)
                    status.Add(sstatus);
            }
            return status;
        }
        /// <summary>
        /// Метод для отримання не архівних запитів
        /// </summary>
        /// <returns>Список активних запитів</returns>
        public static List<object> GetCallsNotArchived()
        {

            List<object> calls = new List<object>();
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                var TCalls = from call in db.Call
                             where call.Status != 3
                             select new
                             {
                                 id = call.id,
                                 CustomerName = call.User1.UserLN.ToString() + " "+ call.User1.UserFN.ToString(),

                                 AgentName = call.User.UserLN.ToString() + " " + call.User.UserFN,

                                 DateCreated = call.DateCreated,
                                 Status = call.CallStatus.Status,
                                 DateSolved = call.DateSolved,
                                 CallText = (call.CallText.Length > 30 ? call.CallText.Substring(0, 30) : call.CallText),
                             };
                foreach (var tmp in TCalls)
                {
                    calls.Add(tmp);
                }
            }
            return calls;
        }
        /// <summary>
        /// Метод для отримання архівних запитів
        /// </summary>
        /// <returns>Список архівних запитів</returns>

        public static List<object> GetCallsArchived()
        {

            List<object> calls = new List<object>();
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                var TCalls = from call in db.Call
                             where call.Status == 3
                             select new
                             {
                                 id = call.id,
                                 CustomerName = call.User1.UserLN.ToString() + " " + call.User1.UserFN.ToString(),

                                 AgentName = call.User.UserLN.ToString() + " " + call.User.UserFN,

                                 DateCreated = call.DateCreated,
                                 Status = call.CallStatus.Status,
                                 DateSolved = call.DateSolved,
                                 CallText = call.CallText.Substring(0, 50),
                             };
                foreach (var tmp in TCalls)
                {
                    calls.Add(tmp);
                }
            }
            return calls;
        }

        /// <summary>
        /// Метод для отримання перевірки причини архівації запита в бд з введеною, та додавання її в бд(якщо збігів немає)
        /// </summary>

        static void CheckReason(string Reason)
        {
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                if ((from R in db.CallArchivedReason where R.Reason == Reason select R).Count() == 0)
                {
                    db.CallArchivedReason.Add(new CallArchivedReason() { Reason = Reason });
                    db.SaveChanges();
                }
            }
            
        }

        /// <summary>
        /// Метод для отримання списку причин архівації запита
        /// </summary>
        /// <returns> Список причин архівації запита </returns>

        public static List<object> GetReasons(string term)
        {
            List<object> ListReasons = new List<object>();
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                var Reasons = from Reas in db.CallArchivedReason
                           where Reas.Reason.Contains(term)
                           select new { value = Reas.Reason, label = Reas.Reason };

                foreach(var tmp in Reasons)
                {
                    ListReasons.Add(tmp);
                }
            }
            return ListReasons;
        }
        /// <summary>
        /// Метод для отримання активних запитів
        /// </summary>
        /// <returns>Активні запити</returns>

        public static void ActivateCall(Call ACall, int Status )
        {
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                Call Call = (from call in db.Call
                             where call.id == ACall.id
                             select call).First();
                Call.Status = Status;
                CheckReason(ACall.Reason);
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
        /// <summary>
        /// Метод для отримання архівних запитів
        /// </summary>
        /// <returns>Архівні запити</returns>

        public static void ArchiveCall(Call callArch)
        {
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                Call Call = (from call in db.Call
                            where call.id == callArch.id
                            select call).First();
                Call.Status = 3;
                Call.Reason = callArch.Reason;
                Call.DateArchived = DateTime.Now;
                CheckReason(callArch.Reason);
                db.SaveChanges();
            }
        }

        public static List<SelectListItem> GetStatusList()
        {
            List<SelectListItem> status = new List<SelectListItem>();
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
               
                var st = from Status in db.CallStatus where Status.Status != "Archived" select new SelectListItem() { Value = Status.id.ToString(), Text = Status.Status };
                

                foreach (var tmp in st)
                    status.Add(tmp);
            }
            return status;
        }
    }

}
