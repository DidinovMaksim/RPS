using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using RPS.Models;
using RPS.ValidationModels;
using Newtonsoft.Json;
using RPS.Services;
using System.Data.Entity;

namespace RPS.Controllers
{
    public class AgentController : Controller
    {
        /// <summary>
        /// Представление по умолчанию
        /// </summary>
        /// <returns>Возвращает представление по умолчанию</returns>
        
        [Authorize(Roles = "Agent")]
        public ActionResult Index()
        {
            return View();

        }
        /// <summary>
        /// Информация по таблицам
        /// </summary>
        /// <returns>Возвращает информацию по запросам для таблицы</returns>
        [HttpGet]
        public string getGridData()
        {
            List<object> calls = AgentServices.GetCalls();
            return JsonConvert.SerializeObject(calls);
        }
        /// <summary>
        /// Частичное представление всплывающего окна 
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Возвращает частичное представление для всплывающего окна</returns>
        [HttpGet]
        public PartialViewResult _ReplyCall(String id)
        {
            return PartialView(new CallValidation());
        }
        /// <summary>
        /// Метод, срабатывающий по нажатию на кнопку сабмит в форме попапа.
        /// </summary>
        /// <param name="call"></param>
        /// <returns>Вовзращает статус выполнения.</returns>
        [HttpPost]
        public JsonResult _ReplyCall(CallValidation call)
        {
            if (ValidateAnswer(call))
            {
                AgentServices.AddAnswer(new Call { id = call.id, Answer = call.Answer });
                return Json(new
                {
                    State = "Call replied successfully!"
                }, JsonRequestBehavior.AllowGet);
            }
            else
                return Json(new
                {
                    State = "Call not replied! Try again!"
                }, JsonRequestBehavior.AllowGet);
        }
        /// <summary>
        /// Метод валидации ответа на запрос.
        /// </summary>
        /// <param name="call"></param>
        /// <returns>Возвращает булевую переменную в зависимости от успешности валидации.</returns>
        bool ValidateAnswer(CallValidation call)
        {
            if (!String.IsNullOrEmpty(call.Answer) && call.id != 0) return true;
            else return false;
        }
        /// <summary>
        /// Метод, вовзращающий запрос с указанным id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Возвращает запрос с указанным идентификатором</returns>
        public JsonResult GetCall(int id)
        {
            object RCall = AgentServices.GetCall(id);
            return Json(RCall, JsonRequestBehavior.AllowGet);
        }
    }
}