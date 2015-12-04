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

function HandleError(data) {
    alert("error");
    console.log(data);
}

function Attach(rowid) {
    //alert(rowid);
    ////Reading agents list
    //$.ajax({
    //    //url: 'Dispatcher/GetAgentsList',
    //    url: 'Dispatcher/GetDict',
    //    contentType: 'application/json; charset=utf-8',
    //    type: 'GET',
    //    success: function (result) {
    //        result = JSON.parse(result);

    //        console.log(result);

    //        $('#attachAgentID').empty();
    //        $(result).each(function (index, item) {

    //            var option = $('<option data-value="' + item.Key + '" value="' + item.Value + '"></option>')
    //            $('#attachAgentID').append(option);
    //        })

    //        jQuery("#attachCall").dialog("open");



    //        //$('#popup').html(result);
    //        //$('#popup').dialog({
    //        //    width: 350,
    //        //    height: 350
    //        //});
    //    }
    //});



    //var rowId = $("#jqgDispatcher").jqGrid('getGridParam', 'selrow');
    //var rowData = $("#jqgDispatcher").getRowData(rowId);


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
                width: 350
               // height: 350
            });
        }
    });
}

function CreateNewCall() {

    $.ajax({
        url: 'Dispatcher/AddCall',

        contentType: 'application/json; charset=utf-8',
        type: 'GET',
        success: function (result) {
            $('#popup').html(result);
            $('#popup').dialog({
                width: 400
               // height: 350
            });
        }
    });
}


(function ($) {

    $(document).ready(function () {
        loadTable();

        

        jQuery("#callInfo").dialog({
            autoOpen: false,
            width: 400
        });
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
                    colNames: ['id', 'Status', 'Call date', 'Attach', 'Customer', 'Agent', 'CustomerLN', 'CustomerEmail', 'CustomerPhone', 'CallText'],
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
                            formatter: 'date',
                            formatoptions: { newformat: 'd.m.Y' }
                        },
                        {
                            name: "Attach",
                            index: "Attach",
                            width:50,
                            formatter: function (cellvalue, options, rowobject) {
                                
                                return '<button id="openbtn" onclick="Attach(' + rowobject.id + ')" >Attach</button>';
                            },
                            search: false,

                        },
                        {
                            name: 'User1.UserFN',
                            index: 'User1.UserFN',
                           // width: 80,
                            sortable: true,

                            formatter: function (cellvalue, options, rowobject) { 
                                return cellvalue + ' ' + rowobject.User1.UserLN;
                            },

                            search: false,
                        },
                        {
                            name: 'User.UserFN',
                            index: 'User.UserFN',
                          //  width: 80,
                            sortable: true,

                            formatter: function (cellvalue, options, rowobject) {
                                return cellvalue + ' ' + rowobject.User.UserLN;
                            },

                            search: false,
                        },

                        { name: 'User1.UserLN', index: 'User1.UserLN', hidden: true },
                        { name: 'User1.Email', index: 'User1.Email', hidden: true },
                        { name: 'User1.MPhone', index: 'User1.MPhone', hidden: true },
                        { name: 'CallText', index: 'CallText', hidden: true },



                    ],
                    data: JSON.parse(result),
                    rowNum: 10,
                    autowidth: true,
                    pager: jQuery("#pager"),
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


                        //var callData = $("#jqgDispatcher").getGridParam('data')[iRow - 1];

                        var callData = $("#jqgDispatcher").getRowData(rowid);

                        document.getElementById("callInfoCustName").innerHTML = callData['User1.UserFN'];// + ' ' + callData['User1.UserLN'];
                        document.getElementById("callInfoCustEmail").innerHTML = callData['User1.Email'];
                        document.getElementById("callInfoCustPhone").innerHTML = callData['User1.MPhone'];
                        document.getElementById("callInfoCallText").innerHTML = callData['CallText'];

                        //document.getElementById("callInfoCustName").innerHTML = callData.User1.UserFN + ' ' + callData.User1.UserLN;
                        //document.getElementById("callInfoCustEmail").innerHTML = callData.User1.Email;
                        //document.getElementById("callInfoCustPhone").innerHTML = callData.User1.MPhone;
                        //document.getElementById("callInfoCallText").innerHTML = callData.CallText;

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
                        var ids = jQuery("#jqgDispatcher").jqGrid('getDataIDs');
                        for (var i = 0; i < ids.length; i++) {
                            var cl = ids[i];
                            reply = '<input  type="button" id = "replyBtn" onclick="TestButtonClick()" />'

                            jQuery("#jqgDispatcher").jqGrid('setRowData', ids[i], { Actions: reply });
                        }
                    },
                    loadComplete: function (data) {

                        document.getElementById("cssload-thecube").style.display = 'none';


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
                    }
                }
                );
                $("#jqgDispatcher").jqGrid('filterToolbar', { searchOnEnter: false });
            }
        })
    }


}(jQuery));
//}