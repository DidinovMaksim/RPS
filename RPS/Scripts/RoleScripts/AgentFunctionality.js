function CallReplied(data) {
    reloadJQGrid();
    $('#popup').html(data.State);
    $('#popup').dialog({
        height: 100,
    });
    setTimeout(function () {
        $('#popup').dialog('close')
    }, 2000);

}

function GetCall(callback) {
    var rowId = $("#jqgAgent").jqGrid('getGridParam', 'selrow');
    $.ajax({
        url: 'Agent/GetCall',
        datatype: "json",
        data: {
            id: rowId
        },
        contentType: "application/json; charset=utf-8",
        mathod: 'GET',
        success: function (result) {
            callback(result);
        }
    });
}
function FillCallInfo(call) {
    document.getElementById("callText").value = call.CallText;
    document.getElementById("callDateCreated").value = call.DateCreated;

    document.getElementById("callCustName").value = call.UserFN;
    document.getElementById("callCustSur").value = call.UserLN;

}
function FillPopup(call) {
    document.getElementById("CustName").value = call.UserFN + " " + call.UserLN;
    document.getElementById("CallText").value = call.CallText;

}
function Reply() {


    var rowId = $("#jqgAgent").jqGrid('getGridParam', 'selrow');
    var rowData = $("#jqgAgent").getRowData(rowId);
    /*
    jQuery("#Reply").dialog("open");
    document.getElementById("id").value = rowData['id'];
    
    */

    $.ajax({
        url: 'Agent/_ReplyCall',
        data: {
            id: rowId
        },
        contentType: 'application/json; charset=utf-8',
        type: 'GET',
        success: function (result) {
            GetCall(FillPopup);
            $('#popup').html(result);
            $('#popup').dialog({
                show: {
                    effect: "blind",
                    duration: 1000
                },

                hide: "fadeOut",
                width: 350,
                height: 350,


            });
        }
    });
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
        jQuery("#Reply").dialog({
            autoOpen: false,
            width: 400,
        });
    });
    function loadTable() {

        var gridSelector = '#jqgAgent';
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
                    colNames: ["id", 'Status', 'Was created by', 'Was solved by', "Customer name", "Reply"],
                    colModel: [
                        {
                            name: 'id',
                            index: 'id',
                            key: true,
                            hidden: true
                        },
                        {
                            name: 'Status',
                            index: 'Status',
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
                            searchoptions: {
                                sopt: ['eq', 'lt', 'le', 'gt', 'ge'],
                                dataInit: function (elem) {
                                    $(elem).datepicker({
                                        changeMonth: true, changeYear: true,
                                        dateFormat: 'yy-mm-dd'
                                    });
                                }
                            }
                            /*searchoptions: {
                                sopt: ['xxxx'],
                                searchOnEnter: false,
                                autosearch: true,
                                dataInit: function (el) { $(el).datepicker({ dateFormat: 'yy-mm-dd' }); }
                            }*/
                        },
                        {
                            name: 'DateSolved',
                            index: 'DateSolved',
                            width: 80,
                            sortable: true,
                            search: false,

                        },
                        {
                            name: 'CustomerName',
                            index: 'CustomerName',
                            width: 80,
                            sortable: true,
                            formatter: function (cellvalue, options, rowobject) {
                                return rowobject.CustomerName + " " + rowobject.CustomerSurname;
                            },
                            search: false,
                        },
                        {
                            name: "Reply",
                            index: "Reply",
                            formatter: function (cellvalue, options, rowobject) {
                                if (rowobject.Status == "Active")
                                    return '<button id="openbtn" onclick="Reply()" >Reply</button>';
                                else return "Call already replied!";
                            },
                            search: false,

                        },
                    ],
                    data: JSON.parse(result),
                    rowNum: 10,
                    autowidth: true,
                    pager: jQuery("#pager"),
                    rowList: [10, 20, 30, 40],
                    viewrecords: true,
                    caption: "Active calls",
                    onSelectRow: function () {
                        document.getElementById("callInfo").style.display = 'inline';

                        GetCall(FillCallInfo);


                    },
                    jsonReader: {
                        root: "rows",
                        page: "pages",
                        total: "total",
                        repeatitems: false,
                        id: "0"
                    },
                    gridComplete: function () {
                        var ids = jQuery("#jqgAgent").jqGrid('getDataIDs');
                        for (var i = 0; i < ids.length; i++) {
                            var cl = ids[i];
                            reply = '<input  type="button" id = "replyBtn" onclick="TestButtonClick()" />'

                            jQuery("#jqgAgent").jqGrid('setRowData', ids[i], { Actions: reply });
                        }
                    },
                    loadComplete: function (data) {

                        document.getElementById("cssload-thecube").style.display = 'none';

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

                        $("#jqgAgent").jqGrid('sortGrid', 'Status', false, 'asc');
                    },
                }).navGrid("#jqgAgent", { edit: false, add: false, del: false });
                $("#jqgAgent").jqGrid('filterToolbar', { searchOnEnter: false });
            }
        })
    }
    


}(jQuery));
//}
