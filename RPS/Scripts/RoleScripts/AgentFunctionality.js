function Reply()
{
    jQuery(".Reply").dialog("open");
    var rowId = $("#jqgAgent").jqGrid('getGridParam', 'selrow');
    var rowData = $("#jqgAgent").getRowData(rowId);

    document.getElementById("custId").value = rowData['id'];

}
function reloadJQGrid() {
    $.ajax({
        url: 'Agent/getGridData',
        datatype: "json",
        data: "{}",
        contentType: "application/json; charset=utf-8",
        mathod: 'GET',
        success: function (result) {
            jQuery("#jqgAgent")
            .jqGrid('setGridParam',
                {
                    datatype: 'local',
                    data: JSON.parse(result)
                })
        .trigger("reloadGrid");
        }
    });
}

(function ($) {
    
    $(document).ready(function () {
        loadTable();
        jQuery(".Reply").dialog({autoOpen:false});
    });
    function loadTable(){

            var gridSelector = '#jqgAgnt';
            var arOps = ["eq", "ne", "lt", "le", "gt", "ge", "bw", "bn", "in", "ni", "ew", "en", "cn", "nc"];

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

                                search: false,
                            },
                            {
                                name: 'DateCreated',
                                index: 'DateCreated',
                                width: 80,
                                sortable: true,
                                sorttype: "date",
                            },
                            {
                                name: 'DateSolved',
                                index: 'DateSolved',
                                width: 80,
                                sortable: true,
                                search: false,

                            },
                            {
                                name: 'User1.Login',
                                index: 'User.Login',
                                width: 80,
                                sortable: true,

                                search: false,
                            },
                            {
                                name:"Reply",
                                index:"Reply",
                                formatter: function (cellvalue, options, rowobject) {
                                    return '<button id="openbtn" onclick="Reply()" >Reply</button>';
                                },
                                search: false,
                            
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
                        gridComplete: function ()
                        {
                            var ids = jQuery("#jqgAgent").jqGrid('getDataIDs');
                            for (var i = 0; i < ids.length; i++)
                            {
                                var cl = ids[i];
                                reply = '<input  type="button" id = "replyBtn" onclick="TestButtonClick()" />'
                           
                                jQuery("#jqgAgent").jqGrid('setRowData', ids[i], { Actions: reply });
                            }
                        },
                        loadComplete: function (data) {
                            var newCapture = "",
                                filters, rules, rule, op, i, iOp, s
                            postData = $('#jqgAgent').jqGrid("getGridParam", "postData"),
                            isFiltering = $('#jqgAgent').jqGrid("getGridParam", "search");

                            if (isFiltering === true && typeof postData.filters !== "undefined") {
                                filters = $.parseJSON(postData.filters);
                                newCapture = "Filter: [";
                                rules = filters.rules;
                                for (i = 0; i < rules.length; i++) {
                                    rule = rules[i];
                                    op = rule.op; // the code name of the operation
                                    iOp = $.inArray(op, arOps);
                                    if (iOp >= 0 && typeof $.jgrid.search.odata[iOp] !== "undefined") {
                                        op = $.jgrid.search.odata[iOp].text;
                                    }
                                    newCapture += rule.field + " " + op + " '" + rule.data + "'";
                                    if (i + 1 !== rules.length) {
                                        newCapture += ", ";
                                    }
                                }
                                newCapture += "]";
                            }
                            $(gridSelector).jqGrid("setCaption", newCapture);
                            $(this).triggerHandler("jqGridLoadComplete", data);
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
                    $("#jqgAgent").jqGrid('filterToolbar', { searchOnEnter: false });
                }
            })
        }

    
    }(jQuery));
//}
