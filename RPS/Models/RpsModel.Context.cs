﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class DB_9DF713_RPSEntities : DbContext
    {
        public DB_9DF713_RPSEntities()
            : base("name=DB_9DF713_RPSEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Call> Call { get; set; }
        public virtual DbSet<CallArchivedReason> CallArchivedReason { get; set; }
        public virtual DbSet<CallStatus> CallStatus { get; set; }
        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<webpages_Roles> webpages_Roles { get; set; }
    }
}
