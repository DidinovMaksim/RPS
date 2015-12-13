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

function FillEditPopup(user) {
    document.getElementById("fname").value = user.UserFN;
    document.getElementById("lname").value = user.UserLN;
    document.getElementById("phone").value = user.MPhone;
    document.getElementById("email").value = user.Email;
    document.getElementById("login").value = user.Login;
    document.getElementById("id").value = user.id;
}

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

function EditUser(userId) {

    $.ajax({
        url: 'EditUser',
        data: {
            id: userId
        },
        contentType: 'application/json; charset=utf-8',
        type: 'GET',
        success: function (result) {
            console.log("зашел в вызов попапап");
            console.log(result);

            $('#editUserWindow').html(result);
            $('#editUserWindow').dialog('open');
            GetUser(FillEditPopup);
        }
    });
}

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
        $("#addUserWindow").dialog({ autoOpen: false, width: 500, height: 500, title: "Add user" });
        $("#editUserWindow").dialog({ autoOpen: false, width: 500, height: 460, title: "Edit user" });
        $("#datepicker").datepicker();
    });
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
                }).navGrid("#pager", { del: true },
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
                });
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