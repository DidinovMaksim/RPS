

function DeleteCustomer(rowId)
{
    $.ajax({
        url: 'DeleteCustomer',
        data: {
            id: rowId
        },
        contentType: 'application/json; charset=utf-8',
        type: 'GET',
        success: function (result) {
            ReloadJQGrid();
            $('#deleteCustomerWindow').dialog("open");
            $('#deleteCustomerWindow').html(result.State);
        }
    });
}

function AddCustomer() {
    jQuery("#addCustomerWindow").dialog("open");
    $.ajax({
        url: 'AddCustomer',
        data: {},
        contentType: 'application/json; charset=utf-8',
        type: 'GET',
        success: function (result) {
            $('#addCustomerWindow').html(result);
        }
    });
}

function EditStatus(data) {
    console.log(data);
    ReloadJQGrid();
    $('#editCustomerWindow').html(data.State);
    $('#editCustomerWindow').dialog({
        height: 100,
    });
    setTimeout(function () {
        $('#editCustomerWindow').dialog('close')
    }, 2000);
}

function FillEditCustomerPopup(customer) {
    console.log(customer);
    document.getElementById("login").value = customer.Login;
    document.getElementById("fname").value = customer.UserFN;
    document.getElementById("lname").value = customer.UserLN;
    document.getElementById("phone").value = customer.MPhone;
    document.getElementById("datepicker").value = customer.Birthday;
    document.getElementById("email").value = customer.Email;

}

function GetCustomer(callback) {
    var rowId = $("#jqgAdminCustomers").jqGrid('getGridParam', 'selrow');
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
        url: 'EditCustomer',
        data: {
            id: userId
        },
        contentType: 'application/json; charset=utf-8',
        type: 'GET',
        success: function (result) {
            $('#editCustomerWindow').html(result);
            $('#editCustomerWindow').dialog('open');
            GetCustomer(FillEditCustomerPopup);
        }
    });
}

function ReloadJQGrid() {
    //alert("reload working");
    //jQuery("#jqgAdminCustomers").setGridParam({ url: 'Administrator/getGridDataCustomers' }).trigger("reloadGrid");

    $.ajax({
        url: 'getGridDataCustomers',
        datatype: "json",
        data: "{}",
        contentType: "application/json; charset=utf-8",
        mathod: 'GET',
        async: true,
        success: function (result) {
            

            jQuery("#jqgAdminCustomers")
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
        LoadTableCustomers();
        $("#deleteCustomerWindow").dialog({ autoOpen: false, width: 300, height: 250, title: "Delete customer" });
        $("#addCustomerWindow").dialog({ autoOpen: false, width: 500, height: 415, title: "Add customer" });
        $("#editCustomerWindow").dialog({ autoOpen: false, width: 500, height: 415, title: "Edit customer" });
        $("#datepicker").datepicker({ dateFormat: 'dd.mm.yy' });
    });

    function LoadTableCustomers() {

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
                    
            url: 'getGridDataCustomers',
                    datatype: "local",
                    colNames: ['id', 'User name', 'User last name', 'Phone', 'Birthday', 'Delete user'],
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
                            sortable: true,
                            sorttype: "text",
                            search: false,
                            sortable: false,
                            editable: true
                        },
                        {
                            name: 'Birthday',
                            index: 'Birthday',
                            width: 80,
                            hidden: false,
                            sortable: false,
                            sorttype: "text",
                            search: true,
                            editable: true,
                            formatoptions: { newformat: 'Y.m.d ' },
                        },
                        {
                            name: "EditUser",
                            index: "EditUser",
                            formatter: function (cellvalue, options, rowobject) {
                                
                                return '<button class="edit" id="openedit" onclick="DeleteCustomer(' + rowobject.id + ')" ><i class="fa fa-trash"></i></button>';
                            },
                            search: false,
                            align: 'center'
                        },
                    ],
                    ondblClickRow: function (rowid, iRow, iCol, e) {
                        EditUser(rowid);
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
                $("#jqgAdminCustomers").jqGrid('filterToolbar', { searchOnEnter: false });
            }
        })
    }
}(jQuery));