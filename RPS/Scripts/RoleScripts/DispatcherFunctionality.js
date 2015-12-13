function reloadJQGrid() {
    $.ajax({
        url: 'Dispatcher/getGridData',
        datatype: "json",
        data: "{}",
        contentType: "application/json; charset=utf-8",
        mathod: 'GET',
        success: function (result) {
            jQuery("#jqgDispatcher")
            .jqGrid('setGridParam',
                {
                    datatype: 'local',
                    data: JSON.parse(result)
                })
        .trigger("reloadGrid");
        }
    });
}

function Attach(rowid) {
    $.ajax({
        url: 'Dispatcher/AttachAgent',
        data: {
            id: rowid
        },
        contentType: 'application/json; charset=utf-8',
        type: 'GET',
        success: function (result) {
            $('#popup').html(result);
            $('#popup').dialog({
                show: {
                    effect: "blind",
                    duration: 1000
                },

                hide: "fadeOut",
                width: 450,
                height: 250
            });
        }
    });
}

function AgentAttached(data) {
    reloadJQGrid();
    //$('#popup').html(data.State);
    $('#popup').dialog({
        height: 100,
    });
    setTimeout(function () {
        $('#popup').dialog('close')
    }, 2000);

}

function CallAdded(data) {
    reloadJQGrid();
    //$('#popup').html(data.State);
    $('#popup').dialog({
        height: 100,
    });
    setTimeout(function () {
        $('#popup').dialog('close')
    }, 2000);

}

function CreateNewCall() {

    $.ajax({
        url: 'Dispatcher/AddCall',

        contentType: 'application/json; charset=utf-8',
        type: 'GET',
        success: function (result) {
            $('#popup').html(result);
            $('#popup').dialog({
                show: {
                    effect: "blind",
                    duration: 1000
                },

                hide: "fadeOut",

                width: 450,
                height: 400
            });
        }
    });
}

function CallInfo(rowid)
{
    $.ajax({
        url: 'Dispatcher/CallInfo',

        contentType: 'application/json; charset=utf-8',
        type: 'GET',
        success: function (result) {

            $.ajax({
                url: 'Dispatcher/GetCallInfo',
                data: {
                    id : rowid
                },
                contentType: 'application/json; charset=utf-8',
                type: 'GET',
                success: function (result) {
                    
                    result = JSON.parse(result);

                    document.getElementById("callInfoCustName").innerHTML = result['CustomerFN'] + ' ' + result['CustomerLN'];
                    document.getElementById("callInfoCustEmail").innerHTML = result['Email'];
                    document.getElementById("callInfoCustPhone").innerHTML = result['Phone'];
                    document.getElementById("callInfoCallText").innerHTML = result['CallText'];
                }
            });

            $('#popup').html(result);
            $('#popup').dialog({
                show: {
                    effect: "blind",
                    duration: 1000
                },

                hide: "fadeOut",
                width: 400,
                height: 400
            });
        }
    });
}

(function ($) {

    $(document).ready(function () {
        loadTable();

        

        //jQuery("#callInfo").dialog({
        //    autoOpen: false,
        //    width: 400
        //});
    });

    function loadTable() {

        var gridSelector = '#jqgDispatcher';
        var arOps = ["eq", "ne", "lt", "le", "gt", "ge", "bw", "bn", "in", "ni", "ew", "en", "cn", "nc"];

        $.ajax({
            url: 'Dispatcher/getGridData',
            datatype: "json",
            data: "{}",
            contentType: "application/json; charset=utf-8",
            method: "GET",
            success: function (result) {

                $("#jqgDispatcher").jqGrid({
                    datatype: "local",
                    colNames: ['id', 'Status', 'Call date', 'Attach', 'Customer', 'Agent'],
                    colModel: [
                        {
                            name: 'id',
                            index: 'id',
                            key: true,
                            hidden: true
                        },
                        {
                            name: 'CallStatus',
                            index: 'CallStatus',
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
                            formatter: 'date',
                            formatoptions: { newformat: 'd.m.Y' }
                        },
                        {
                            name: "Attach",
                            index: "Attach",
                            width:50,
                            formatter: function (cellvalue, options, rowobject) {
                                return '<button id="openbtn" class="btn btn-default" onclick="Attach(' + rowobject.id + ')" >Attach</button>';
                            },
                            search: false,

                        },
                        {
                            name: 'CustomerFN',
                            index: 'CustomerFN',
                            sortable: true,

                            formatter: function (cellvalue, options, rowobject) { 
                                return cellvalue + ' ' + rowobject.CustomerLN;
                            },

                            search: false,
                        },
                        {
                            name: 'AgentFN',
                            index: 'AgentFN',
                            sortable: true,

                            formatter: function (cellvalue, options, rowobject) {
                                return cellvalue? (cellvalue + ' ' + rowobject.AgentLN) : '';
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
                    caption: "RPS",

                    ondblClickRow: function (rowid, iRow, iCol, e) {


                        CallInfo(rowid);
                    },
                    jsonReader: {
                        root: "rows",
                        page: "pages",
                        total: "total",
                        repeatitems: false,
                        id: "0"
                    },
                    //gridComplete: function () {
                    //    var ids = jQuery("#jqgDispatcher").jqGrid('getDataIDs');
                    //    for (var i = 0; i < ids.length; i++) {
                    //        var cl = ids[i];
                    //        reply = '<input  type="button" id = "replyBtn" onclick="TestButtonClick()" />'

                    //        jQuery("#jqgDispatcher").jqGrid('setRowData', ids[i], { Actions: reply });
                    //    }
                    //},
                    loadComplete: function (data) {

                        document.getElementById("cssload-thecube").style.display = 'none';
                        document.getElementById("createCallBtn").style.display = 'block';

                        var newCapture = "",
                            filters, rules, rule, op, i, iOp, s
                        postData = $('#jqgDispatcher').jqGrid("getGridParam", "postData"),
                        isFiltering = $('#jqgDispatcher').jqGrid("getGridParam", "search");

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
                }).navGrid("#pager", { edit: false, add: false, del: true },
                {
                    //edit options
                    zIndex: 100,
                    url: 'Dispatcher/EditGridData',
                    closeOnEscape: true,
                    closeAfterEdit: true,
                    recreateForm: true,
                    afterComplete: function (result) {
                    }
                },

                //add options
                {
                    zIndex: 100,
                    url: 'Dispatcher/AddGridData',
                    closeOnEscape: true,
                    closeAfterEdit: true,
                    afterComplete: function (result) {
                    }
                },
                //delete
                {
                    zIndex: 100,
                    url: 'Dispatcher/DeleteGridData',
                    closeOnEscape: true,
                    closeAfterEdit: true,
                    recreateForm: true,
                    msg: "Are you sure ?",
                    afterComplete: function (result) {
                        reloadJQGrid();
                    }
                }
                );
                $("#jqgDispatcher").jqGrid('filterToolbar', { searchOnEnter: false });
            }
        })
    }


}(jQuery));
//}