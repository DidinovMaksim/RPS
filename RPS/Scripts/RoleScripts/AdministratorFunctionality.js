

//проверка пароля
function CheckPasswords(div)
{
    var p1 = jQuery("#" + div + ' #password').val();
    var p2 = jQuery("#" + div + ' #password_second').val();

    if (p1 != p2) {

        jQuery('#'+div+' #password').css({ "backgroundColor": "red" });
        jQuery('#'+div+' #password_second').css({ "backgroundColor": "red" });
        jQuery('#' + div + '  #submit').prop('disabled', true);
    }
    else {
        jQuery('#'+div+' #password').css({ "backgroundColor": "green" });
        jQuery('#'+div+' #password_second').css({ "backgroundColor": "green" });
        jQuery('#' + div + '  #submit').prop('disabled', false);
    }
}
//события проверки пароля
function PasswordCheckEvents()
{
    jQuery('#edit-user-window-form #password').on('input', function () {
        CheckPasswords('edit-user-window-form');
    });
    jQuery('#edit-user-window-form #password_second').on('input', function () {
        CheckPasswords('edit-user-window-form');
    });
    jQuery('#add-user-window-form #password').on('input', function () {
        CheckPasswords('add-user-window-form');
    });
    jQuery('#add-user-window-form #password_second').on('input', function () {
        CheckPasswords('add-user-window-form');
    });
}
//проверка логина
function CheckLogin()
{
    jQuery('#add-user-window-form #login').on('input', function () {
        var loginForm = jQuery("#add-user-window-form #login").val();
        $.ajax({
            url: 'CheckLogin',
            datatype: "json",
            data: {
                login: loginForm
            },
            contentType: "application/json; charset=utf-8",
            mathod: 'GET',
            success: function (result) {
                console.log(result);
                if (result == "True")
                {
                    jQuery('#add-user-window-form #login').css({ "backgroundColor": "red" });
                    jQuery('#add-user-window-form #submit').prop('disabled', true);
                }
                else {
                    jQuery('#add-user-window-form #login').css({ "backgroundColor": "green" });
                    jQuery('#add-user-window-form #submit').prop('disabled', false);
                }
            }
        });
    });
}
//добавление юзеров
function AddUser() {
    jQuery("#addUserWindow").dialog("open");
    $.ajax({
        url: 'AddUser',
        data: {},
        contentType: 'application/json; charset=utf-8',
        type: 'GET',
        success: function (result) {
            reloadJQGrid();
            $('#addUserWindow').html(result);
        }
    });
}
//статус операции
function EditStatus(data) {
    reloadJQGrid();
    $('#editUserWindow').html(data.State);
    $('#editUserWindow').dialog({
        height: 100,
    });
    setTimeout(function () {
        $('#editUserWindow').dialog('close')
    }, 2000);
}
//добавление статуса
function AddStatus(data)
{
    reloadJQGrid();
    $('#addUserWindow').html(data.State);
    $('#addUserWindow').dialog({
        height: 100,
    });
    setTimeout(function () {
        $('#addUserWindow').dialog('close')
    }, 2000);
}
//заполнение попапа для редактирования
function FillEditPopup(user) {
    jQuery('#edit-user-window-form #fname').val(user.UserFN);
    jQuery('#edit-user-window-form #lname').val(user.UserLN);
    jQuery('#edit-user-window-form #phone').val(user.MPhone);
    jQuery('#edit-user-window-form #email').val(user.Email);
    jQuery('#edit-user-window-form #login').val(user.Login);
    jQuery('#edit-user-window-form #id').val(user.id);
}
//возвращает юзера
function GetUser(callback) {
    var rowId = $("#jqgAdmin").jqGrid('getGridParam', 'selrow');
    $.ajax({
        url: 'GetUser',
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
//редактирование юзеров
function EditUser(userId) {

    $.ajax({
        url: 'EditUser',
        data: {
            id: userId
        },
        contentType: 'application/json; charset=utf-8',
        type: 'GET',
        success: function (result) {

            $('#editUserWindow').html(result);
            $('#editUserWindow').dialog('open');
            GetUser(FillEditPopup);
        }
    });
}
//перезагрузка таблицы
function reloadJQGrid() {
    $.ajax({
        url: 'getGridDataUsers',
        datatype: "json",
        data: "{}",
        contentType: "application/json; charset=utf-8",
        mathod: 'GET',
        success: function (result) {
            jQuery("#jqgAdmin")
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
        loadTableCustomers()
        $("#addUserWindow").dialog({ autoOpen: false, width: 500, height: 550, title: "Add user" });
        $("#editUserWindow").dialog({ autoOpen: false, width: 500, height: 460, title: "Edit user" });
        $("#datepicker").datepicker();
        PasswordCheckEvents();
        CheckLogin();
        
    });
    //загрузка таблицы
    function loadTable() {
        var gridSelector = '#jqgAdmin';
        var arOps = ["eq", "ne", "lt", "le", "gt", "ge", "bw", "bn", "in", "ni", "ew", "en", "cn", "nc"];

        $.ajax({
            url: 'getGridDataUsers',
            datatype: "json",
            data: "{}",
            contentType: "application/json; charset=utf-8",
            method: "GET",
            success: function (result) {
                $("#jqgAdmin").jqGrid({
                    datatype: "local",
                    colNames: ['id', 'Login', 'User name', 'User role', 'User last name', 'Email', 'Phone', 'Birthday', 'Status', 'Edit user'],
                    colModel: [
                        {
                            name: 'id',
                            index: 'id',
                            key: true,
                            hidden: true,
                            sortable: false,
                        },
                        {
                            name: 'Login',
                            index: 'Login',
                            width: 150,
                            search: true,
                            sorttype: "text",
                            editable: true
                        },
                        {
                            name: 'UserFN',
                            index: 'UserFN',
                            width: 80,
                            search: false,
                            sortable: false,
                            editable: true
                        },
                        {
                            name: 'Role',
                            index: 'Role',
                            width: 80,
                            search: false,
                            sortable: false,
                        },
                        {
                            name: 'UserLN',
                            index: 'UserLN',
                            width: 80,
                            hidden: false,
                            search: false,
                            sortable: false,
                            editable: true
                        },
                        {
                            name: 'Email',
                            index: 'Email',
                            width: 80,
                            sortable: true,
                            sorttype: "date",
                            search: true,
                            editable: true
                        },
                        {
                            name: 'MPhone',
                            index: 'MPhone',
                            width: 80,
                            sorttype: "text",
                            search: false,
                            sortable: false,
                            editable: true
                        },
                        {
                            name: 'Birthday',
                            index: 'Birthday',
                            width: 80,
                            hidden: true,
                            sortable: false,
                            search: false,
                            editable: true
                        },
                        {
                            name: 'IsActive',
                            index: 'IsActives',
                            width: 80,
                            sortable: false,
                            search: false,
                            editable: true,
                            formatter: function (cellvalue, options, rowobject) {
                                if (rowobject.IsActive == true) 
                                    return 'Active';
                                else
                                    return 'Disabled';
                            }
                        },
                        {
                            name: "EditUser",
                            index: "EditUser",
                            formatter: function (cellvalue, options, rowobject) {
                                return '<button class="edit" id="openedit" onclick="EditUser('+rowobject.id+')" ><i class="fa fa-pencil"></i></button>';
                            },
                            search: false,
                            align: 'center'
                        },
                    ],
                    onSelectRow: function () {
                        GetUser(FillEditPopup);
                    },
                    data: JSON.parse(result),
                    rowNum: 15,
                    autowidth: true,
                    pager: jQuery("#pager"),
                    rowList: [15, 30, 45, 60],
                    viewrecords: true,
                    caption: "RPS",
                    search: true,
                    height: 350,
                    jsonReader: {
                        cell: ""
                    },
                    jsonReader: {
                        root: "rows",
                        page: "pages",
                        total: "total",
                        repeatitems: false,
                        id: "0"
                    },
                    loadComplete: function (data) {
                        var newCapture = "RPS",
                            filters, rules, rule, op, i, iOp, s
                        postData = $('#jqgAdmin').jqGrid("getGridParam", "postData"),
                        isFiltering = $('#jqgAdmin').jqGrid("getGridParam", "search");

                        if (isFiltering === true && typeof postData.filters !== "undefined") {
                            filters = $.parseJSON(postData.filters);
                            newCapture = "Filter: [";
                            rules = filters.rules;
                            for (i = 0; i < rules.length; i++) {
                                rule = rules[i];
                                op = rule.op;
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
                    onSelectRow: function () {

                    }
                }).navGrid();
                $("#jqgAdmin").jqGrid('filterToolbar', { searchOnEnter: false });
            }
        })
    }
    function loadTableCustomers() {

        var gridSelector = '#jqgAdminCustomers';
        var arOps = ["eq", "ne", "lt", "le", "gt", "ge", "bw", "bn", "in", "ni", "ew", "en", "cn", "nc"];

        $.ajax({
            url: 'getGridDataCustomers',
            datatype: "json",
            data: "{}",
            contentType: "application/json; charset=utf-8",
            method: "GET",
            success: function (result) {
                $("#jqgAdminCustomers").jqGrid({
                    datatype: "local",
                    colNames: ['id', 'User name', 'User last name', 'Phone', 'Birthday', 'Edit user'],
                    colModel: [
                        {
                            name: 'id',
                            index: 'id',
                            key: true,
                            hidden: true,
                            sortable: false,
                        },
                        {
                            name: 'UserFN',
                            index: 'UserFN',
                            width: 80,
                            search: true,
                            sortable: false,
                            editable: true
                        },
                        {
                            name: 'UserLN',
                            index: 'UserLN',
                            width: 80,
                            hidden: false,
                            search: false,
                            sortable: false,
                            editable: true
                        },
                        {
                            name: 'MPhone',
                            index: 'MPhone',
                            width: 80,
                            sorttype: "text",
                            search: false,
                            sortable: false,
                            editable: true
                        },
                        {
                            name: 'Birthday',
                            index: 'Birthday',
                            width: 80,
                            hidden: true,
                            sortable: false,
                            sorttype: "date",
                            search: true,
                            editable: true
                        },
                        {
                            name: "EditUser",
                            index: "EditUser",
                            formatter: function (cellvalue, options, rowobject) {
                                return '<button class="edit" id="openedit" onclick="EditUser()" ><i class="fa fa-pencil"></i></button>';
                            },
                            search: false,
                            align: 'center'
                        },
                    ],
                    ondblClickRow: function (rowid, iRow, iCol, e) {
                        GetUser(FillEditPopup);
                    },
                    data: JSON.parse(result),
                    rowNum: 15,
                    autowidth: true,
                    pager: jQuery("#pager"),
                    rowList: [15, 30, 45, 60],
                    viewrecords: true,
                    caption: "RPS",
                    search: true,
                    height: 350,
                    jsonReader: {
                        cell: ""
                    },
                    jsonReader: {
                        root: "rows",
                        page: "pages",
                        total: "total",
                        repeatitems: false,
                        id: "0"
                    },
                    loadComplete: function (data) {
                        var newCapture = "RPS",
                            filters, rules, rule, op, i, iOp, s
                        postData = $('#jqgAdminCustomers').jqGrid("getGridParam", "postData"),
                        isFiltering = $('#jqgAdminCustomers').jqGrid("getGridParam", "search");

                        if (isFiltering === true && typeof postData.filters !== "undefined") {
                            filters = $.parseJSON(postData.filters);
                            newCapture = "Filter: [";
                            rules = filters.rules;
                            for (i = 0; i < rules.length; i++) {
                                rule = rules[i];
                                op = rule.op;
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
                    onSelectRow: function () {

                    }
                }).navGrid();
                $("#jqgAdminCustomers").jqGrid('filterToolbar', { searchOnEnter: false });
            }
        })
    }
}(jQuery));
