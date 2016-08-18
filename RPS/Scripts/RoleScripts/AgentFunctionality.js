
function CallReplied(data) {
    // Метод который вызывается после выполнения функции в попапе.
    // Отображает статус выполнения и закрывает попап.
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
    // Метод, отображающий информацию по выбранному запросу в инфо секции
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
    // Метод, заполняющий секцию информации про запрос
    if (call.Answer != null) {
        document.getElementById("cAnswer").innerHTML = call.Answer;
        document.getElementById("CallAnswer").style.display = 'table-row';
    }
    else
        document.getElementById("CallAnswer").style.display = 'none';

    document.getElementById("CustName").innerHTML = call.CustomerName;

    document.getElementById("callText").innerHTML = call.CallText;
    document.getElementById("callDateCreated").innerHTML = call.DateCreated;
  

}
function FillPopup(call) {
    // Метод, заполняющий попап
    document.getElementById("CustNamePop").innerHTML = call.CustomerName;
    document.getElementById("CallText").innerHTML = call.CallText;

}
function Reply(idCall) {
    // Метод, вызывающий попап для ответа на запрос.

    var rowId = $("#jqgAgent").jqGrid('getGridParam', 'selrow');
    var rowData = $("#jqgAgent").getRowData(rowId);

    $.ajax({
        url: 'Agent/_ReplyCall',
        data: {
            id: idCall
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
    // Метод перезагрузки грида
    $.ajax({
        url: 'Agent/getGridData',
        datatype: "json",
        data: "{}",
        contentType: "application/json; charset=utf-8",
        mathod: 'GET',
        success: function (result) {
            console.log(result);
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
function loadTable() {
    // Метод запгрузки и заполнения грида
    var gridSelector = '#jqgAgent';
    var arOps = ["eq", "ne", "lt", "le", "gt", "ge", "bw", "bn", "in", "ni", "ew", "en", "cn", "nc"];
    var pageWidth = $("#jqgAgent").parent().width() - 100;

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
                        width: (pageWidth * (10 / 100)),
                        sortable: true,

                        search: false,
                        formatter: function (cellvalue, options, rowobject) {
                            if (rowobject.Status == "Active")
                                return '<img src = "http://cdn.mysitemyway.com/etc-mysitemyway/icons/legacy-previews/icons/simple-red-square-icons-alphanumeric/128239-simple-red-square-icon-alphanumeric-question-mark.png" width = "20" height = "20">';
                            else return '<img src = "https://livelovely.com/static/images/full-listing/icon-modal-success@2x.png" width = "18" height = "18">';

                        },

                    },
                    {
                        name: 'DateCreated',
                        index: 'DateCreated',
                        width: (pageWidth * (20 / 100)),
                        sortable: true,
                        sorttype: "date",

                        //formatter: 'date', 
                        //formatoptions: { srcformat: 'Y-m-dTH:i:s', newformat: 'Y-m-d H:i:s' },

                        searchoptions: {
                            sopt: ['eq', 'lt', 'le', 'gt', 'ge'],
                            dataInit: function (elem) {
                                $(elem).datepicker({
                                    changeMonth: true, changeYear: true,
                                    dateFormat: 'yy-mm-dd'
                                });
                            }
                        },
                    },
                    {
                        name: 'DateSolved',
                        index: 'DateSolved',
                        width: (pageWidth * (20 / 100)),
                        sortable: true,
                        search: false,
                        formatter: 'date',
                        formatoptions: { srcformat: 'Y-m-dTH:i:s', newformat: 'd.m.Y H:i:s' }

                    },
                    {
                        name: 'CustomerName',
                        index: 'CustomerName',
                        width: (pageWidth * (30 / 100)),
                        sortable: true,
                        search: false,
                    },
                    {
                        name: "Reply",
                        index: "Reply",
                        width: (pageWidth * (20 / 100)),
                        formatter: function (cellvalue, options, rowobject) {
                            if (rowobject.Status == "Active")
                                return '<button id="openbtn" onclick="Reply(' + rowobject.id + ')" >Reply</button>';
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
                caption: "RPS",
                height: 350,

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

                    var newCapture = "RPS",
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

                    //$("#jqgAgent").jqGrid('sortGrid', 'Status', false, 'asc');
                },
            }).navGrid("#jqgAgent", { edit: false, add: false, del: false, search: false });
            $("#jqgAgent").jqGrid('filterToolbar', { searchOnEnter: false });
            $("#jqgAgent").sortGrid('Status', false, 'asc');
        }
    })
}
(function ($) {
    // Действия выполняемые при загрузке скрипта

    $(document).ready(function () {
        loadTable();
        jQuery("#Reply").dialog({
            autoOpen: false,
            width: 400,
        });
    });
}(jQuery));
