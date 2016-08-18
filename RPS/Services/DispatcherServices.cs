using System;
using System.Collections.Generic;
using System.Linq;
using RPS.Models;
using System.Web.Mvc;
using System.Data.Entity;

namespace RPS.Services
{
    /// <summary>
    /// Клас з сервісами для бази даних для сторінки диспетчера
    /// </summary>
    public class DispatcherServices
    {
        /// <summary>
        /// Метод для отримання інформації по запиту
        /// </summary>
        /// <param name="id">Ідентифікатор запиту</param>
        /// <returns>Об'єкт з інформацією про запит та клієнта</returns>
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

        /// <summary>
        /// Метод для отримання клієнтів
        /// </summary>
        /// <param name="term">Перші літери ім'я або прізвища клієнта</param>
        /// <returns>Список підходящих клієнтів</returns>
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

        /// <summary>
        /// Метод для отримання агентів
        /// </summary>
        /// <returns>Список агентів</returns>
        public static List<SelectListItem> GetAgents()
        {
            List<SelectListItem> agents = new List<SelectListItem>();
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                agents.Add(new SelectListItem { Value = null, Text = "" });
                List<User> us = (from user in db.User where user.webpages_Roles.Count != 0 select user).ToList();

                var Tagents = from user in us
                             where user.webpages_Roles.First().RoleName == "Agent"
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

        /// <summary>
        /// Метод для отримання ідентифікатора агента по запиту
        /// </summary>
        /// <param name="callId">Ідентифікатор запита</param>
        /// <returns>Ідентифікатор агента або NULL</returns>
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

        /// <summary>
        /// Метод для отримання активних запитів
        /// </summary>
        /// <returns>Список активних запитів</returns>
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

        /// <summary>
        /// Метод для призначення запиту агента
        /// </summary>
        /// <param name="id">Ідентифікатор запиту</param>
        /// <param name="Agent">Ідентифікатор агента</param>
        public static void AttachAgent(int id, int? Agent)
        {
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                var upd = from call in db.Call where call.id == id select call;
                upd.ToList()[0].Agent = Agent;
                db.SaveChanges();
            }
        }

        /// <summary>
        /// Метод для додавання запиту в базу
        /// </summary>
        /// <param name="call">Запит, який необхідно додати</param>
        /// <returns>Результат операції</returns>
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

        /// <summary>
        /// Метод, модифікуючий запит в базі
        /// </summary>
        /// <param name="call">Запит, який необхідно модифікувати</param>
        public static void EditData(Call call)
        {
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                db.Call.Attach(call);
                db.Entry(call).State = EntityState.Modified;
                db.SaveChanges();
            }
        }

        /// <summary>
        /// Метод, видаляючий з бази сервісний запит
        /// </summary>
        /// <param name="call">Запит, який необхідно видалити</param>
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
