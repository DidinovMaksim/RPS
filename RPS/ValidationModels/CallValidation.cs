using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using RPS.Models;

namespace RPS.ValidationModels
{
    public class CallValidation
    {
        public int id { get; set; }
        public int Customer { get; set; }
        public int Agent { get; set; }
        public string CallText { get; set; }
        public System.DateTime DateCreated { get; set; }
        public int Status { get; set; }
        public Nullable<System.DateTime> DateSolved { get; set; }
        public Nullable<System.DateTime> DateArchived { get; set; }
        public string Reason { get; set; }
        public bool IsDeleted { get; set; }

        public void AddAnswer()
        {
            DB_9DF713_RPSEntities db = new DB_9DF713_RPSEntities();
            var upd = from call in db.Call where call.id == id select call;
            upd.ToList()[0].Reason = Reason;
            upd.ToList()[0].Status = 1;
            upd.ToList()[0].DateSolved = DateTime.Now;
            db.SaveChanges();
        }


    }
}