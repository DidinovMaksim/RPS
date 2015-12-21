using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using RPS.Models;
using System.Net;
using System.Net.Mail;
using System.Web.Mvc;
using System.Data.Entity;

using Newtonsoft.Json;

namespace RPS.Services
{
    /// <summary>
    /// Класс сервисов для работы агента
    /// </summary>
    public class AgentServices
    {
        /// <summary>
        /// Метод для получениия инормации об указаном пользователе
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Возвращает информацию про указанного пользователя</returns>
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
        /// <summary>
        /// Метод добавления ответа к запросу
        /// </summary>
        /// <param name="Call"></param>
        public static void AddAnswer(Call Call)
        {
            using (DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities())
            {
                var upd = (from call in db.Call where call.id == Call.id select call).First();
                upd.Answer = Call.Answer;
                upd.Status = 2;
                upd.DateSolved = DateTime.Now;
                try
                {
                    var client = new SmtpClient("smtp.gmail.com", 587)
                    {
                        Credentials = new NetworkCredential("requestsprocessingsystem@gmail.com", "RPS_IT_craft"),
                        EnableSsl = true
                    };

                    MailMessage msg = new MailMessage(new MailAddress("requestsprocessingsystem@gmail.com", "RPS")
                        , new MailAddress(upd.User1.Email));
                    
                    msg.Body = "Hello, " + upd.User1.UserFN + "!\n\n";
                    msg.Body += "You were asking us:\n";
                    msg.Body += upd.CallText + "\n\n";
                    msg.Body += "To solve your problem please try next:\n";
                    msg.Body += upd.Answer + "\n\n";
                    msg.Body += "Thank you for using our system!\nRespectfully,\nRPS team";

                    msg.Subject = "Answer for: " + (upd.CallText.Length > 30 ? upd.CallText.Substring(0, 30) : upd.CallText);
                    client.Send(msg);
                }
                catch (Exception ex) { }
                

                db.SaveChanges();
            }

        }
        /// <summary>
        /// Метод получения информацие о запросе
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Возвращает информацию о указанном запросе</returns>
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
        /// Получение списка запросов привязанных к агенту
        /// </summary>
        /// <returns>Возвращает список запросов</returns>
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
        /// <summary>
        /// Метод получения идентификатора текущего агента
        /// </summary>
        /// <returns>Возвращает идентификатор текущего агента</returns>
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