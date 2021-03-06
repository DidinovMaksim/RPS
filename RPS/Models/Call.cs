//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace RPS.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Call
    {
        public int id { get; set; }
        public int Customer { get; set; }
        public Nullable<int> Agent { get; set; }
        public string CallText { get; set; }
        public System.DateTime DateCreated { get; set; }
        public int Status { get; set; }
        public Nullable<System.DateTime> DateSolved { get; set; }
        public Nullable<System.DateTime> DateArchived { get; set; }
        public string Answer { get; set; }
        public string Reason { get; set; }
        public bool IsDeleted { get; set; }
    
        public virtual User User { get; set; }
        public virtual CallStatus CallStatus { get; set; }
        public virtual User User1 { get; set; }
    }
}
