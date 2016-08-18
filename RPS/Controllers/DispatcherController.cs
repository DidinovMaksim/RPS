using System;
using System.Web.Mvc;
using RPS.Models;
using RPS.ValidationModels;
using Newtonsoft.Json;

namespace RPS.Controllers
{
    /// <summary>
    /// Клас, приймаючий та обробляючий усі HTTP запити зі сторінки диспетчера
    /// </summary>
    public class DispatcherController : Controller
    {
        /// <summary>
        /// Метод, який викликається за замовчуванням
        /// </summary>
        /// <returns>Повертає представлення з головною сторінкою диспетчера</returns>
        [Authorize(Roles = "Dispatcher")]
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Метод для отримання активних запитів для таблиці
        /// </summary>
        /// <returns>Повертає список активних запитів у JSON форматі</returns>
        public string getGridData()
        {
            
            return JsonConvert.SerializeObject(Services.DispatcherServices.GetActiveCalls(), Formatting.None,
                        new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        });
        }

        
        /// <summary>
        /// Метод для модифікації запита в базі
        /// </summary>
        /// <param name="call">Запит, який необхідно модифікувати</param>
        /// <returns>Результат операції</returns>
        public string EditGridData(Call call)
        {
            Services.DispatcherServices.EditData(call);
            return "Edited";
        }

        /// <summary>
        /// Метод для видалення запиту з бази
        /// </summary>
        /// <param name="call">Запит, який необхідно видалити</param>
        /// <returns>Результат операції</returns>
        public string DeleteGridData(Call call)
        {
            Services.DispatcherServices.DeleteCall(call);
            return "Deleted";
        }

        /// <summary>
        /// Метод для отримання списку клієнтів для автодоповнюючого списку
        /// </summary>
        /// <param name="term">Підстрока в імені або прізвищі клієнта</param>
        /// <returns>Список клієнтів у JSON форматі</returns>
        public string GetCustomersJSON(string term)
        {
            return JsonConvert.SerializeObject(Services.DispatcherServices.GetCustomers(term), Formatting.Indented,
                        new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        });
        }

        /// <summary>
        /// Метод для показу спливаючого вікна для призначення агента
        /// </summary>
        /// <param name="id">Ідентифікатор сервісного запиту</param>
        /// <returns>Часткове представлення для вікна призначення агента</returns>
        [HttpGet]
        public PartialViewResult AttachAgent(int id)
        {
            //Зчитуємо список агентів
            ViewData["AgentsList"] = Services.DispatcherServices.GetAgents();
            return PartialView(new CallValidation { Agent = Services.DispatcherServices.GetAgentIdByCall(id) });
        }

        /// <summary>
        /// Метод для призначення нового агента запиту
        /// </summary>
        /// <param name="id">Ідентифікатор запиту</param>
        /// <param name="Agent">Ідентифікатор агента</param>
        /// <returns>Результат операції</returns>
        [HttpPost]
        public string AttachAgent(int id, int? Agent)
        {
            Services.DispatcherServices.AttachAgent(id, Agent);
            return "<p>Succes</p>";
        }

        /// <summary>
        /// Метод для показу спливаючого вікна додавання запита
        /// </summary>
        /// <returns>Часткове представлення для вікна додавання запита</returns>
        public PartialViewResult AddCall()
        {
            //Зчитуємо список агентів
            ViewData["AgentsList"] = Services.DispatcherServices.GetAgents();
            return PartialView(new CallValidation());
        }

        /// <summary>
        /// Метод для додавання нового запиту у базу
        /// </summary>
        /// <param name="call">Об'єкт зі зчитаними з форми параметрами запита</param>
        /// <returns>Результат операції</returns>
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

        /// <summary>
        /// Метод для показу спливаючого вікна з інформацією про запит
        /// </summary>
        /// <returns>Часткове представлення для вікна з інформацією про запит</returns>
        public PartialViewResult CallInfo()
        {
            return PartialView();
        }

        /// <summary>
        /// Метод для вибору інформації про сервісний запит
        /// </summary>
        /// <param name="id">Ідентифікатор запиту</param>
        /// <returns>JSON об'єкт з даними про клієнта та текст запиту</returns>
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
