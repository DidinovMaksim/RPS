using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using RPS.Models;
using System.Web.Mvc;

namespace RPS.Services
{
    public class ArchivistServices
    {
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
    }

}