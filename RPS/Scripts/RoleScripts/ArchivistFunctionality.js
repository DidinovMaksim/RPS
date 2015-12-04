﻿
function reloadJQGridArchived() {
    $.ajax({
        url: 'Archivist/getGridDataArchived',
        datatype: "json",
        data: "{}",
        contentType: "application/json; charset=utf-8",
        mathod: 'GET',
        success: function (result) {
            jQuery("#jqgArchivist")
            .jqGrid('setGridParam',
                {
                    datatype: 'local',
                    data: JSON.parse(result)
                })
        .trigger("reloadGrid");
        }
    });
}

function reloadJQGridActive() {
    $.ajax({
        url: 'Archivist/getGridDataActive',
        datatype: "json",
        data: "{}",
        contentType: "application/json; charset=utf-8",
        mathod: 'GET',
        success: function (result) {
            jQuery("#jqgArchivistActive")
            .jqGrid('setGridParam',
                {
                    datatype: 'local',
                    data: JSON.parse(result)
                })
        .trigger("reloadGrid");
        }
    });
}

function Archived() {
    jQuery("#archivedCall").dialog("open");
}

function Active() {
    jQuery("#activeCall").dialog("open");
}
(function ($) {

    $(document).ready(function () {
        loadTableActive();
        loadTable();

        jQuery("#callInfo").dialog({
            autoOpen: false,
            width: 400
        });

        jQuery("#archivedCall").dialog({
            autoOpen: false,
            width: 400
        });
        jQuery("#activeCall").dialog({
            autoOpen: false,
            width: 400
        });
    });


    $(function () {
        $("#tabs").tabs();
    });


    function loadTableActive() {

        var gridSelector = '#jqgArchivistActive';
        var arOps = ["eq", "ne", "lt", "le", "gt", "ge", "bw", "bn", "in", "ni", "ew", "en", "cn", "nc"];

        $.ajax({
            url: 'Archivist/getGridDataActive',
            datatype: "json",
            data: "{}",
            contentType: "application/json; charset=utf-8",
            method: "GET",
            success: function (result) {

                $("#jqgArchivistActive").jqGrid({
                    datatype: "local",
                    colNames: ['id', 'Status', 'Data create', 'Customer', 'Qestion', 'Agent', 'Active'],
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
                            width: 50,
                            sortable: true,

                            search: false,
                        },
                        {
                            name: 'Date created',
                            index: 'DateCreated',
                            width: 50,
                            sortable: true,
                            sorttype: "date",
                        },
                        {
                            name: 'User1.UserFN',
                            index: 'User1.UserFN',
                            width: 50,
                            sortable: true,

                            search: false,
                        },
                        {
                            name: 'Question',
                            index: 'Question',
                            width: 100,
                            sortable: true,
                            search: false,

                        },
                        {
                            name: 'User.UserFN',
                            index: 'User.UserFN',
                            width: 50,
                            sortable: true,

                            search: false,
                        },
                        {
                            name: 'Active',
                            index: 'Active',
                            width: 50,
                            formatter: function (cellvalue, options, rowobject) {
                                return '<button id="openbtn1" onclick="Active()" >Active</button>';
                            },
                            search: false,
                        },




                    ],
                    data: JSON.parse(result),
                    rowNum: 10,
                    autowidth: true,
                    pager: jQuery("#pagerActive"),
                    rowList: [10, 20, 30, 40],
                    viewrecords: true,
                    caption: "RPS",
                    //onSelectRow: function () {
                    //    var rowId = $("#jqgDispatcher").jqGrid('getGridParam', 'selrow');
                    //    var rowData = $("#jqgDispatcher").getRowData(rowId);

                    //    document.getElementById("callText").value = rowData['CallText'];
                    //    document.getElementById("callDateCreated").value = rowData['DateCreated'];

                    //    //alert(JSON.parse(result)[]["User1"]["UserFN"]);
                    //    //document.getElementById("callCustName").value = rowData['User.Login'];
                    //    document.getElementById("callCustName").value = rowData['User1.UserFN'];
                    //    document.getElementById("callCustSur").value = rowData['User1.UserLN'];


                    //},
                    ondblClickRow: function (rowid, iRow, iCol, e) {
                        var callData = $("#jqgArchivistActive").getGridParam('data')[iRow - 1];

                        document.getElementById("callInfoCustName").innerHTML = callData.User1.UserFN + ' ' + callData.User1.UserLN;
                        document.getElementById("callInfoCustEmail").innerHTML = callData.User1.Email;
                        document.getElementById("callInfoCustPhone").innerHTML = callData.User1.MPhone;
                        document.getElementById("callInfoCallText").innerHTML = callData.CallText;

                        jQuery("#callInfo").dialog("open");

                    },
                    jsonReader: {
                        root: "rows",
                        page: "pages",
                        total: "total",
                        repeatitems: false,
                        id: "0"
                    },
                    gridComplete: function () {
                        var ids = jQuery("#jqgArchivistActive").jqGrid('getDataIDs');
                        for (var i = 0; i < ids.length; i++) {
                            var cl = ids[i];
                            reply = '<input  type="button" id = "replyBtn" onclick="TestButtonClick()" />'

                            jQuery("#jqgArchivistActive").jqGrid('setRowData', ids[i], { Actions: reply });
                        }
                    },
                    loadComplete: function (data) {

                        document.getElementById("cssload-thecube").style.display = 'none';


                        var newCapture = "",
                            filters, rules, rule, op, i, iOp, s
                        postData = $('#jqgArchivistActive').jqGrid("getGridParam", "postData"),
                        isFiltering = $('#jqgArchivistActive').jqGrid("getGridParam", "search");

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
                }).navGrid("#pagerActive", { edit: false, add: false, del: true },
                {
                    //edit options
                    zIndex: 100,
                    url: 'Archivist/EditGridData',
                    closeOnEscape: true,
                    closeAfterEdit: true,
                    recreateForm: true,
                    afterComplete: function (result) {
                    }
                },

               // add options
                {
                    zIndex: 100,
                    url: 'Archivist/AddGridData',
                    closeOnEscape: true,
                    closeAfterEdit: true,
                    afterComplete: function (result) {

                    }
                },
                //delete
                {
                    zIndex: 100,
                    url: 'Archivist/DeleteGridData',
                    closeOnEscape: true,
                    closeAfterEdit: true,
                    recreateForm: true,
                    msg: "Are you sure ?",
                    afterComplete: function (result) {
                    }
                }
                );
                $("#jqgArchivistActive").jqGrid('filterToolbar', { searchOnEnter: false });
            }
        })
    }


    function loadTable() {

        var gridSelector = '#jqgArchivist';
        var arOps = ["eq", "ne", "lt", "le", "gt", "ge", "bw", "bn", "in", "ni", "ew", "en", "cn", "nc"];

        $.ajax({
            url: 'Archivist/getGridDataArchived',
            datatype: "json",
            data: "{}",
            contentType: "application/json; charset=utf-8",
            method: "GET",
            success: function (result) {

                $("#jqgArchivist").jqGrid({
                    datatype: "local",
                    colNames: ['id', 'Status', 'Data create', 'Data close', 'Customer', 'Qestion', 'Agent', 'Archived'],
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
                            width: 50,
                            sortable: true,

                            search: false,
                        },
                        {
                            name: 'Date created',
                            index: 'DateCreated',
                            width: 50,
                            sortable: true,
                            sorttype: "date",
                        },
                        {
                            name: 'Date closed',
                            index: 'DateClosed',
                            width: 50,
                            sortable: true,
                            sorttype: "date",
                        },
                        {
                            name: 'User1.UserFN',
                            index: 'User1.UserFN',
                            width: 50,
                            sortable: true,

                            search: false,
                        },
                        {
                            name: 'Question',
                            index: 'Question',
                            width: 100,
                            sortable: true,
                            search: false,

                        },
                        {
                            name: 'User.UserFN',
                            index: 'User.UserFN',
                            width: 50,
                            sortable: true,

                            search: false,
                        },
                        {
                            name: 'Archived',
                            index: 'Archived',
                            width: 50,
                            formatter: function (cellvalue, options, rowobject) {
                                return '<button id="openbtn" onclick="Archived()" >Archived</button>';
                            },
                            search: false,
                        },

                    ],
                    data: JSON.parse(result),
                    rowNum: 10,
                    autowidth: true,
                    pager: jQuery("#pagerArchived"),
                    rowList: [10, 20, 30, 40],
                    viewrecords: true,
                    caption: "RPS",

                    ondblClickRow: function (rowid, iRow, iCol, e) {


                        var callData = $("#jqgArchivist").getGridParam('data')[iRow - 1];

                        document.getElementById("callInfoCustName").innerHTML = callData.User1.UserFN + ' ' + callData.User1.UserLN;
                        document.getElementById("callInfoCustEmail").innerHTML = callData.User1.Email;
                        document.getElementById("callInfoCustPhone").innerHTML = callData.User1.MPhone;
                        document.getElementById("callInfoCallText").innerHTML = callData.CallText;

                        jQuery("#callInfo").dialog("open");
                    },
                    jsonReader: {
                        root: "rows",
                        page: "pages",
                        total: "total",
                        repeatitems: false,
                        id: "0"
                    },
                    gridComplete: function () {
                        var ids = jQuery("#jqgArchivist").jqGrid('getDataIDs');
                        for (var i = 0; i < ids.length; i++) {
                            var cl = ids[i];
                            reply = '<input  type="button" id = "replyBtn" onclick="TestButtonClick()" />'

                            jQuery("#jqgArchivist").jqGrid('setRowData', ids[i], { Actions: reply });
                        }
                    },
                    loadComplete: function (data) {

                        document.getElementById("cssload-thecube").style.display = 'none';


                        var newCapture = "",
                            filters, rules, rule, op, i, iOp, s
                        postData = $('#jqgArchivist').jqGrid("getGridParam", "postData"),
                        isFiltering = $('#jqgArchivist').jqGrid("getGridParam", "search");

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
                }).navGrid("#pagerArchived", { edit: false, add: false, del: true },
                {
                    //edit options
                    zIndex: 100,
                    url: 'Archivist/EditGridData',
                    closeOnEscape: true,
                    closeAfterEdit: true,
                    recreateForm: true,
                    afterComplete: function (result) {
                    }
                },

                //add options
                {
                    zIndex: 100,
                    url: 'Archivist/AddGridData',
                    closeOnEscape: true,
                    closeAfterEdit: true,
                    afterComplete: function (result) {

                    }
                },
                //delete
                {
                    zIndex: 100,
                    url: 'Archivist/DeleteGridData',
                    closeOnEscape: true,
                    closeAfterEdit: true,
                    recreateForm: true,
                    msg: "Are you sure ?",
                    afterComplete: function (result) {
                    }
                }
                );
                $("#jqgArchivist").jqGrid('filterToolbar', { searchOnEnter: false });
            }
        })
    }

}(jQuery));
//}
