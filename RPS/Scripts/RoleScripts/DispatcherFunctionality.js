//Функція для перезавантаження даних у таблиці
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

//Функція для призначення агенту запита
//rowid - ідентифікатор запита
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
            //Налаштування спливаючого вікна
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

//Функція-колбек по призначенню агента запиту
function AgentAttached(data) {
    //Оновлюємо дані у таблиці
    reloadJQGrid();

    //Закриваємо вікно
    $('#popup').dialog({
        height: 100,
    });
    setTimeout(function () {
        $('#popup').dialog('close')
    }, 2000);

}

//Функція-колбек по додаванню нового запита
function CallAdded(data) {
    //Оновлюємо дані в таблиці
    reloadJQGrid();

    //Закриваємо вікно
    $('#popup').dialog({
        height: 100,
    });
    setTimeout(function () {
        $('#popup').dialog('close')
    }, 2000);

}

//Функція для додавання нового запита
function CreateNewCall() {

    $.ajax({
        url: 'Dispatcher/AddCall',

        contentType: 'application/json; charset=utf-8',
        type: 'GET',
        success: function (result) {
            $('#popup').html(result);
            //Налаштування вікна
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

//Функція для виведення інформацію по запиту
//rowid - ідентифікатор запита
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
                    //Заповнюємо вікно отриманою інформацією
                    result = JSON.parse(result);

                    document.getElementById("callInfoCustName").innerHTML = result['CustomerFN'] + ' ' + result['CustomerLN'];
                    document.getElementById("callInfoCustEmail").innerHTML = result['Email'];
                    document.getElementById("callInfoCustPhone").innerHTML = result['Phone'];
                    document.getElementById("callInfoCallText").innerHTML = result['CallText'];
                }
            });

            $('#popup').html(result);
            //Налаштування вікна
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
    //Функція по завантаженню сторінки
    $(document).ready(function () {
        loadTable();
    });

    //Функція для ініціалізації таблиці
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
                    height: "100%",
                    hidegrid: false,
                    datatype: "local",
                    //Підписи стовпців
                    colNames: ['id', 'Status', 'Call date', 'Attach', 'Customer', 'Agent'],
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
                            name: 'CallStatus',
                            index: 'CallStatus',
                            width: 150,
                            sortable: true,
                            search: false,
                        },
                        //Дата створення запита
                        {
                            name: 'DateCreated',
                            index: 'DateCreated',
                            width: 80,
                            sortable: true,
                            sorttype: "date",
                            formatter: 'date',
                            formatoptions: { srcformat: 'Y-m-dTH:i:s', newformat: 'd.m.Y H:i:s' },
                            search: false,
                        },
                        //Поле з кнопкою "Призначити"
                        {
                            name: "Attach",
                            index: "Attach",
                            width:50,
                            formatter: function (cellvalue, options, rowobject) {
                                return '<button id="openbtn" class="btn btn-default" onclick="Attach(' + rowobject.id + ')" >Attach</button>';
                            },
                            search: false,
                        },
                        //Поле з ім'ям клієнта
                        {
                            name: 'CustomerFN',
                            index: 'CustomerFN',
                            sortable: true,
                            formatter: function (cellvalue, options, rowobject) { 
                                return cellvalue + ' ' + rowobject.CustomerLN;
                            },

                            search: false,
                        },
                        //Поле з ім'ям агента
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
                    //Функція-колбек по двійному кліку на запит
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

                    //Функція-колбек по завантаженню даних в таблицю
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
                }).navGrid("#pager",
                {
                    edit: false,
                    add: false,
                    del: true
                },
                //Оновлення
                {
                    zIndex: 100,
                    url: 'Dispatcher/EditGridData',
                    closeOnEscape: true,
                    closeAfterEdit: true,
                    recreateForm: true,
                    afterComplete: function (result) {
                    }
                },
                //Видалення
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
