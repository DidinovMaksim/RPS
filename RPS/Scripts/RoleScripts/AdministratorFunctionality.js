function addUser() {
    jQuery(".addUserWindow").dialog("open");
    var rowId = $("#jqgAdmin").jqGrid('getGridParam', 'selrow');
    var rowData = $("#jqgAdmin").getRowData(rowId);
    //document.getElementById("id").value = rowData["id"];
}
function reloadJQGrid() {
    $.ajax({
        url: 'Administrator/getGridData',
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
        jQuery(".addUserWindow").dialog({ autoOpen: false, width: 400 });
    });
    function loadTable() {

        var gridSelector = '#jqgAdmin';
        var arOps = ["eq", "ne", "lt", "le", "gt", "ge", "bw", "bn", "in", "ni", "ew", "en", "cn", "nc"];

        $.ajax({
            url: 'Administrator/getGridData',
            datatype: "json",
            data: "{}",
            contentType: "application/json; charset=utf-8",
            method: "GET",
            success: function (result) {
                console.log(result),
                console.log((JSON.parse(result)[0])["webpages_Roles"][0]["RoleId"]),
                //alert((JSON.parse(result)[0]["webpages_Roles"])),
                $("#jqgAdmin").jqGrid({
                    datatype: "local",
                    colNames: ['id', 'Login', 'User name', 'User role', 'User last name', 'Email', 'Birthday', 'Status'],
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
                            name: 'webpages_Roles.0.RoleName',
                            index: 'webpages_Roles.0.RoleName',
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
                            sorttype: "text",
                            search: true,
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
                            name: 'Status',
                            index: 'Status',
                            width: 80,
                            sortable: false,
                            search: false,
                            editable: true
                        },

                    ],
                    data: JSON.parse(result),
                    rowNum: 10,
                    autowidth: true,
                    pager: jQuery("#pager"),
                    rowList: [10, 20, 30, 40],
                    viewrecords: true,
                    caption: "RPS",
                    search: true,
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
                        var newCapture = "",
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
                        var rowId = $("#jqgAdmin").jqGrid('getGridParam', 'selrow');
                        var rowData = $("#jqgAdmin").getRowData(rowId);
                        document.getElementById("fname").value = rowData['UserFN'];
                        document.getElementById("lname").value = rowData['UserLN'];
                        document.getElementById("phone").value = rowData['MPhone'];
                        document.getElementById("email").value = rowData['Email'];
                        document.getElementById("email").value = rowData['Email'];
                    }
                }).navGrid("#pager", { edit: true, add: true, del: true, search: true, refresh: true },
                {
                    //edit options
                    zIndex: 100,
                    url: 'Test/EditGridData',
                    closeOnEscape: true,
                    closeAfterEdit: true,
                    recreateForm: true,
                    afterComplete: function (result) {
                    }
                },
                //add options
                {
                    zIndex: 100,
                    url: 'Test/AddGridData',
                    closeOnEscape: true,
                    closeAfterEdit: true,
                    afterComplete: function (result) {

                    }
                },
                //delete
                {
                    zIndex: 100,
                    url: 'Test/DeleteGridData',
                    closeOnEscape: true,
                    closeAfterEdit: true,
                    recreateForm: true,
                    msg: "Are you sure ?",
                    afterComplete: function (result) {
                    }
                },
                {
                    multipleSearch: true,
                    multipleGroup: true,
                    showQuery: true
                });
                $("#jqgAdmin").jqGrid('filterToolbar', { searchOnEnter: false });
            }
        })
    }
}(jQuery));