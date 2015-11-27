using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;
using RPS.Models;
using System.Data.Entity;

namespace RPS.Controllers
{
    public class AdministratorController : Controller
    {
        private DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities();
        // GET: Test
        [Authorize(Roles = "Administrator")]
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public string getGridData()
        {


            return JsonConvert.SerializeObject(db.User.ToList(), Formatting.None,
                        new JsonSerializerSettings()
                        {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                        });

        }
        public List<SelectListItem> getRoles()
        {
            List<webpages_Roles> webpagesRolesList = db.webpages_Roles.ToList();
            List<SelectListItem> roleList = new List<SelectListItem>();
            foreach (webpages_Roles role in webpagesRolesList)
            {
                roleList.Add(new SelectListItem { Text = role.RoleName, Value = role.RoleName });
            }
            return roleList;
        }
        public string EditGridData(User usr)
        {
            db.User.Attach(usr);
            db.Entry(usr).State = EntityState.Modified;
            db.SaveChanges();
            return "Edited";
        }

        public string DeleteGridData(User usr)
        {
            db.User.Remove(db.User.Find(usr.id));
            db.SaveChanges();
            return "Deleted";
        }
        public string AddGridData([Bind(Exclude = "id")] User usr)
        {
            db.User.Add(usr);
            db.SaveChanges();
            return "added";
        }
    }
}