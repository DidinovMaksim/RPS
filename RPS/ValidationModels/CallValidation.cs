using System;
using RPS.Models;

namespace RPS.ValidationModels
{
    public class CallValidation
    {
        //Ідентифікатор запиту
        public int id { get; set; }

        //Ідентифікатор клієнта, що залишив запит
        public int Customer { get; set; }

        //Ідентифікатор агента
        public Nullable<int> Agent { get; set; }

        //Текст запиту
        public string CallText { get; set; }

        //Дата створення запита
        public System.DateTime DateCreated { get; set; }

        //Код статусу запита
        public int Status { get; set; }

        //Дата вирішення запиту
        public Nullable<System.DateTime> DateSolved { get; set; }

        //Дата архівації запита
        public Nullable<System.DateTime> DateArchived { get; set; }

        //Причина закриття запита
        public string Reason { get; set; }

        //Чи є архівованим
        public bool IsDeleted { get; set; }

        //Відповідь агента на запит
        public string Answer { get; set; }

    }
}
