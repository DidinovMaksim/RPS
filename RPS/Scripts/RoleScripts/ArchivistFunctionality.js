function CallArchived(data) {

    //Оновлюємо дані у таблицях
    
    reloadJQGridActive();
    reloadJQGridArchived();

    $('#popupArchive').html(data.State); 
   //Налаштування спливаючого вікна
    $('#popupArchive').dialog({
        height: 100,
    });
    setTimeout(function () {
        $('#popupArchive').dialog('close')
    }, 2000);

}
function CallActivated(data) {

    reloadJQGridActive();
    reloadJQGridArchived();

    $('#popupActivate').html(data.State);
    $('#popupActivate').dialog({
        height: 100,
    });
    setTimeout(function () {
        $('#popupActivate').dialog('close')
    }, 2000);

}

function GetCall(callback, idCall) {


    $.ajax({
        url: 'Archivist/GetCall',
        datatype: "json",
        data: {
            id: idCall
        },
        contentType: "application/json; charset=utf-8",
        mathod: 'GET',
        success: function (result) {
            callback(result);
        }
    });
}

function FillPopupArchive(call) {

    jQuery('#archiveCall #CustNamePop').html(call.CustomerName);
    jQuery('#archiveCall #CallText').html(call.CallText);

    console.log(call.Answer);
    if (call.Answer != null)
    {
        jQuery('#archiveCall #AnswerTr').css({ 'display': 'table-row' });
        jQuery('#archiveCall #Answer').html(call.Answer);
    }
    else
        jQuery('#archiveCall #AnswerTr').css({ 'display': 'none' });

}
function FillPopupActivate(call) {
    jQuery('#activateCall #CustNamePop').html(call.CustomerName);
    jQuery('#activateCall #CallText').html(call.CallText);

    if (call.Answer != null) {
        jQuery('#activateCall #AnswerTr').css({ 'display': 'table-row' });
        jQuery('#activateCall #Answer').html(call.Answer);
    }
    else
        jQuery('#activateCall #AnswerTr').css({ 'display': 'none' });


}
//Функція для перезавантаження даних у таблиці архівних запитів
function reloadJQGridArchived() {
    $.ajax({
        url: 'Archivist/getGridDataArchived',
        datatype: "json",
        data: "{}",
        contentType: "application/json; charset=utf-8",
        mathod: 'GET',
        success: function (result) {
            jQuery("#jqgArchivistArchived")
            .jqGrid('setGridParam',
                {
                    datatype: 'local',
                    data: JSON.parse(result)
                })
        .trigger("reloadGrid");
        }
    });
}

//Функція для перезавантаження даних у таблиці активних запитів
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


function Activate(idCall) {


    //jQuery("#archivedCall").dialog("open");
    $.ajax({
        url: 'Archivist/ActivateCall',
        data: {
            id: idCall
        },
        contentType: 'application/json; charset=utf-8',
        type: 'GET',
        success: function (result) {
            GetCall(FillPopupActivate, idCall);
            $('#popupActivate').html(result);
            $('#popupActivate').dialog({
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


function Archive(idCall) {

    $.ajax({
        url: 'Archivist/ArchiveCall',
        data: {
            id: idCall
        },
        contentType: 'application/json; charset=utf-8',
        type: 'GET',
        success: function (result) {
            GetCall(FillPopupArchive, idCall);
            $('#popupArchive').html(result);
            $('#popupArchive').dialog({
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
var gridActiveLoaded = false;
var gridArchivedLoaded = false; 
//Функція для перезавантаження даних у таблиці активних запитів
function loadTableActive() {

    var gridSelector = '#jqgArchivistActive';
    var arOps = ["eq", "ne", "lt", "le", "gt", "ge", "bw", "bn", "in", "ni", "ew", "en", "cn", "nc"];
    var pageWidth = $("#jqgArchivistActive").parent().width() - 100;

    $.ajax({
        url: 'Archivist/getGridDataActive',
        datatype: "json",
        data: "{}",
        contentType: "application/json; charset=utf-8",
        method: "GET",
        success: function (result) {

            $("#jqgArchivistActive").jqGrid({
                datatype: "local",
                    //Підписи стовпців
                colNames: ['id', 'Status', 'Data created', 'Date closed', 'Customer', 'Question', 'Agent', 'Archivate'], 
                    //Налаштування кожного поля
                colModel: [
                        //Прихований ідентифікатор запита
                    {
                        name: 'id',
                        index: 'id',
                        key: true,
                        hidden: true
                    },
                        //Статус запита
                    {
                        name: 'Status',
                        index: 'Status',
                        width: (pageWidth * (5 / 100)),
                        sortable: true,

                        search: false,
                    },
                        //Дата створення запита
                    {
                        name: 'DateCreated',
                        index: 'DateCreated',
                        width: (pageWidth * (15 / 100)),
                        sortable: true,
                        sorttype: "date",
                    },
                        //Дата вирішення запита
                    {
                        name: 'DateSolved',
                        index: 'DateSolved',
                        width: (pageWidth * (15 / 100)),
                        sortable: true,
                        sorttype: "date",
                    },
                        //Поле з ім'ям клієнта
                    {
                        name: 'CustomerName',
                        index: 'CustomerName',
                        width: (pageWidth * (17 / 100)),
                        sortable: true,
                        search: false,
                    },
                        //Поле з текстом запиту

                    {
                        name: 'CallText',
                        index: 'CallText',
                        width: (pageWidth * (24 / 100)),
                        sortable: true,
                        search: false,

                    },
                        //Поле з ім'ям агента
                    {
                        name: 'AgentName',
                        index: 'AgentName',
                        width: (pageWidth * (17 / 100)),
                        sortable: true,
                        search: false,
                    },
                    {
                        name: 'Archive',
                        index: 'Archive',
                        width: (pageWidth * (7 / 100)),
                        formatter: function (cellvalue, options, rowobject) {
                            return '<button id="openbtn1" onclick="Archive(' + rowobject.id + ')" >Archive</button>';
                        },
                        search: false,
                    },




                ],
                data: JSON.parse(result),
                rowNum: 10,
                autowidth: true,
                pager: jQuery("#pagerActive"),
                rowList: [10, 20, 30, 40],
                height: 350,
                viewrecords: true,

                caption: "Active calls",
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
            }).navGrid("#pagerActive", { edit: false, add: false, del: false, search: false, refresh: false }

            );
            $("#jqgArchivistActive").jqGrid('filterToolbar', { searchOnEnter: false });
        }
    })
    gridActiveLoaded = true;
}
//Функція для перезавантаження даних у таблиці архівних запитів
function loadTableArchived() {

    var gridSelector = '#jqgArchivistArchived';
    var arOps = ["eq", "ne", "lt", "le", "gt", "ge", "bw", "bn", "in", "ni", "ew", "en", "cn", "nc"];
    var pageWidth = $("#jqgArchivistArchived").parent().width() - 100;

    $.ajax({
        url: 'Archivist/getGridDataArchived',
        datatype: "json",
        data: "{}",
        contentType: "application/json; charset=utf-8",
        method: "GET",
        success: function (result) {

            $("#jqgArchivistArchived").jqGrid({
                datatype: "local",
                colNames: ['id', 'Status', 'Data created', 'Date closed', 'Customer', 'Question', 'Agent', 'Activate'],
                colModel: [
                        //Прихований ідентифікатор запита
                    {
                        name: 'id',
                        index: 'id',
                        key: true,
                        hidden: true
                    },	
                        //Статус запита
                    {
                        name: 'Status',
                        index: 'Status',
                        width: (pageWidth * (5 / 100)),
                        sortable: true,

                        search: false,
                    },
                        //Дата створення запита
                    {
                        name: 'DateCreated',
                        index: 'DateCreated',
                        width: (pageWidth * (15 / 100)),
                        sortable: true,
                        sorttype: "date",
                    },
                        //Дата вирішення запита
                    {
                        name: 'DateSolved',
                        index: 'DateSolved',
                        width: (pageWidth * (15 / 100)),
                        sortable: true,
                        sorttype: "date",
                    },
//Поле з ім`ям клієнта
                    {
                        name: 'CustomerName',
                        index: 'CustomerName',
                        width: (pageWidth * (17 / 100)),
                        sortable: true,
                        /*formatter: function (cellvalue, options, rowobject) {
                            return rowobject.CustomerName + " " + rowobject.CustomerSurname;
                        },*/

                        search: false,
                    },
//Поле з текстом запиту
                    {
                        name: 'CallText',
                        index: 'CallText',
                        width: (pageWidth * (24 / 100)),
                        sortable: true,
                        search: false,

                    },
//Поле з ім`ям агента
                    {
                        name: 'AgentName',
                        index: 'AgentName',
                        width: (pageWidth * (17 / 100)),
                        sortable: true,
                        /*formatter: function (cellvalue, options, rowobject) {
                            return rowobject.AgentName + " " + rowobject.AgentSurname;
                        },*/
                        search: false,
                    },
                    {
                        name: 'Activate',
                        index: 'Activate',
                        width: (pageWidth * (7 / 100)),
                        formatter: function (cellvalue, options, rowobject) {
                            return '<button id="openbtn1" onclick="Activate(' + rowobject.id + ')" >Activate</button>';
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
                height: 350,
                caption: "Archived calls",
                jsonReader: {
                    root: "rows",
                    page: "pages",
                    total: "total",
                    repeatitems: false,
                    id: "0"
                },
                gridComplete: function () {
                    var ids = jQuery("#jqgArchivistArchived").jqGrid('getDataIDs');
                    for (var i = 0; i < ids.length; i++) {
                        var cl = ids[i];
                        reply = '<input  type="button" id = "replyBtn" onclick="TestButtonClick()" />'

                        jQuery("#jqgArchivistArchived").jqGrid('setRowData', ids[i], { Actions: reply });
                    }
                },
                loadComplete: function (data) {

                    document.getElementById("cssload-thecube").style.display = 'none';


                    var newCapture = "",
                        filters, rules, rule, op, i, iOp, s
                    postData = $('#jqgArchivistArchived').jqGrid("getGridParam", "postData"),
                    isFiltering = $('#jqgArchivistArchived').jqGrid("getGridParam", "search");

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
            }).navGrid("#pagerArchived", { edit: false, add: false, del: false, search: false, refresh: false }

            );
            $("#jqgArchivistArchived").jqGrid('filterToolbar', { searchOnEnter: false });
        }
    })

    gridArchivedLoaded = true;
}
(function ($) {

    $(document).ready(function () {
        loadTableActive();
        //loadTableArchived();

    });
    $(function () {
        $("#tabs").tabs({
            activate: function (event, ui) {
                if (ui.newTab.index() == 0 && gridActiveLoaded == false) {
                    loadTableActive();
                }
                if (ui.newTab.index() == 1 && gridArchivedLoaded == false) {
                    loadTableArchived();
                }
                
            }
        });
    });
}(jQuery));
