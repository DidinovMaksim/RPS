using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

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

    }
}