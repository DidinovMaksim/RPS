using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using RPS.Models;
using RPS.ValidationModels;
using Newtonsoft.Json;
using System.Data.Entity;

using RPS.Services;

namespace RPS.Controllers
{
    /// Клас, приймаючий та обробляючий усі HTTP запити зі сторінки архівіста
    public class ArchivistController : Controller
    {
        DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities();
        
        /// <summary>
        /// Метод, який викликається за замовчуванням
        /// </summary>
        /// <returns>Повертає представлення з головною сторінкою архівіста</returns>

        [Authorize(Roles = "Archivist")]
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Метод для отримання активних запитів для таблиці
        /// </summary>
        /// <returns>Повертає список активних запитів у JSON форматі</returns>

        public string getGridDataActive()
        {
            List<object> calls = ArchivistServices.GetCallsNotArchived();

            return JsonConvert.SerializeObject(calls);
        }

        /// <summary>
        /// Метод для отримання активних запитів для таблиці
        /// </summary>
        /// <returns>Повертає список архівних запитів у JSON форматі</returns>
        public string getGridDataArchived()
        {
            List<object> calls = ArchivistServices.GetCallsArchived();

            return JsonConvert.SerializeObject(calls);
        }

        /// <summary>
        /// Метод для отримання причин архівації запиту для автодоповнюючого списку
        /// </summary>
        /// <param name="term">Підстрока в імені або прізвищі клієнта</param>
        /// <returns>Список клієнтів у JSON форматі</returns>
        public string GetReasonsJSON(string term)
        {         
            return JsonConvert.SerializeObject(ArchivistServices.GetReasons(term));
        }
/// <summary>
        /// Метод для показу спливаючого вікна для архівації запита
        /// </summary>
        /// <returns>Часткове представлення для для архівації запита </returns>
        [HttpGet]
        public PartialViewResult ArchiveCall(String id)
        {
            return PartialView(new CallValidation());
        }
/// <summary>
        /// Метод для архівації запиту
        /// </summary>
        /// <param name="call">Об'єкт зі зчитаними з форми параметрами запита</param>
        /// <returns>Результат операції</returns>


        [HttpPost]
        public JsonResult ArchiveCall(CallValidation call)
        {
            if (ValidateArchive(call))
            {
                ArchivistServices.ArchiveCall(new Call() { id = call.id, Reason = call.Reason });
                return Json(new
                {
                    State = "Call archived successfully!"
                }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new
                {
                    State = "Call not archived! Try again!"
                }, JsonRequestBehavior.AllowGet);


        }
/// <summary>
        /// Метод для показу спливаючого вікна для активації запита
        /// </summary>
        /// <returns>Часткове представлення для активіції запита </returns>

        [HttpGet]
        public PartialViewResult ActivateCall(String id)
        {
            ViewData["StatusList"] = ArchivistServices.GetStatusList();
            return PartialView(new CallValidation());
        }


/// <summary>
        /// Метод для активації запиту
        /// </summary>
        /// <param name="call">Об'єкт зі зчитаними з форми параметрами запита</param>
        /// <returns>Результат операції</returns>

        [HttpPost]
        public JsonResult ActivateCall(CallValidation call, int Status)
        {
            if (ValidateArchive(call) && (Status == 1 || Status == 2))
            {
                ArchivistServices.ActivateCall(new Call() { id = call.id, Reason = call.Reason }, Status);
                return Json(new
                {
                    State = "Call activated successfully!"
                }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new
                {
                    State = "Call not activated! Try again!"
                }, JsonRequestBehavior.AllowGet);


        }
        /// <summary>
        /// Метод для перевірки запита
        /// </summary>

        bool ValidateArchive(CallValidation call)
        {
            if (call.id != 0 && call.Reason != null && call.Reason != "") return true;
            else return false;
        }

        /// <summary>
        /// Метод, який отримує інформацію про запит для вспливаючого вікна
        /// </summary>
        /// <param name="id">Ідентифікатор запиту</param>

        public JsonResult GetCall(int id)
        {

            object RCall = ArchivistServices.GetCall(id);
            return Json(RCall, JsonRequestBehavior.AllowGet);
        }
        



    }
} 
