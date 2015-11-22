
(function ($) {
    
    $(document).ready(function () {
        loadTable();
    });
    function loadTable() {

        $.ajax({
            url: 'Agent/getGridData',
            datatype: "json",
            data: "{}",
            contentType: "application/json; charset=utf-8",
            method: "GET",
            success: function (result) {
                console.log(result);
                $("#jqgAgent").jqGrid({
                    datatype: "local",
                    colNames: ["id", 'Status', 'Was created by', 'Was solved by', "Customer name", "Reply", "CallText", "CustName", "CustSur"],
                    colModel: [
                        {
                            name: 'id',
                            index: 'id',
                            key: true,
                            hidden: true
                        },
                        {
                            name: 'CallStatus.Status',
                            index: 'CallStatus.Status',
                            width: 150,
                            sortable: true,
                        },
                        {
                            name: 'DateCreated',
                            index: 'DateCreated',
                            width: 80,
                            sortable: true,
                        },
                        {
                            name: 'DateSolved',
                            index: 'DateSolved',
                            width: 80,
                            sortable: true,
                        },
                        {
                            name: 'User1.Login',
                            index: 'User.Login',
                            width: 80,
                            sortable: true,
                        },
                        {
                            
                        },
                        {
                            name: 'CallText',
                            index: 'CallText',
                            width: 80,
                            sortable: true,
                            hidden:true
                        },
                        {
                            name: 'User1.UserFN',
                            index: 'User1.UserFN',
                            width: 80,
                            sortable: true,
                            hidden: true
                        },
                        {
                            name: 'User1.UserLN',
                            index: 'User1.UserLN',
                            width: 80,
                            sortable: true,
                            hidden: true
                        },
                    ],
                    data: JSON.parse(result),
                    rowNum: 10,
                    autowidth: true,
                    pager: jQuery("#pager"),
                    rowList: [10, 20, 30, 40],
                    viewrecords: true,
                    caption: "RPS",
                    onSelectRow: function ()
                    {
                        var rowId = $("#jqgAgent").jqGrid('getGridParam', 'selrow');
                        var rowData = $("#jqgAgent").getRowData(rowId);

                        document.getElementById("callText").value = rowData['CallText'];
                        document.getElementById("callDateCreated").value = rowData['DateCreated'];

                        //alert(JSON.parse(result)[]["User1"]["UserFN"]);
                        //document.getElementById("callCustName").value = rowData['User.Login'];
                        document.getElementById("callCustName").value = rowData['User1.UserFN'];
                        document.getElementById("callCustSur").value = rowData['User1.UserLN'];
                        

                    },
                    jsonReader: {
                        root: "rows",
                        page: "pages",
                        total: "total",
                        repeatitems: false,
                        id: "0"
                    },
                }).navGrid("#pager", { edit: true, add: true, del: true },
                {
                    //edit options
                    zIndex: 100,
                    url: 'Agent/EditGridData',
                    closeOnEscape: true,
                    closeAfterEdit: true,
                    recreateForm: true,
                    afterComplete: function (result) {
                    }
                },
                
                //add options
                {
                    zIndex: 100,
                    url: 'Agent/AddGridData',
                    closeOnEscape: true,
                    closeAfterEdit: true,
                    afterComplete: function (result) {

                    }
                },
                //delete
                {
                    zIndex: 100,
                    url: 'Agent/DeleteGridData',
                    closeOnEscape: true,
                    closeAfterEdit: true,
                    recreateForm: true,
                    msg: "Are you sure ?",
                    afterComplete: function (result) {
                    }
                }
                );
            }
        })
    }

    
}(jQuery));