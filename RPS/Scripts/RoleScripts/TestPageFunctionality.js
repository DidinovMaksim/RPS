(function ($) {
    $(document).ready(function() {
        loadTable();
    });
    function loadTable() {
 
        var gridSelector = '#jqg';
        var arOps = ["eq", "ne", "lt", "le", "gt", "ge", "bw", "bn", "in", "ni", "ew", "en", "cn", "nc"];
 
        $.ajax({
            url: 'Test/getGridData',
            datatype: "json",
            data: "{}",
            contentType: "application/json; charset=utf-8",
            method: "GET",
            success: function (result) {
                //console.log(result),
                //console.log((JSON.parse(result)[0])["webpages_Roles"][0]["RoleId"]),
                //alert((JSON.parse(result)[0]["webpages_Roles"])),
                $("#jqg").jqGrid({
                    datatype: "local",
                    colNames: ['id', 'Name', 'IsActive','btn', "User role"],
                    colModel: [
                        {
                            name: 'id',
                            index: 'id',
                            key: true,
                            hidden: false,
                            sorttype: "int",
                            sortable: true
                        },
                        {
                            name: 'Login',
                            index: 'Login',
                            width: 150,
                            sortable: true,
                            editable: true,
                            sorttype:"string",
                        },
                        {
                            name: 'IsActive',
                            index: 'IsActive',
                            width: 80,
                            sortable: true,
                            editable: true,
                            sorttype: "bool",
                        },
                        {
                            name: 'Actions',
                            index: 'Actions',
                            width: 100,
                            height: 120,
                            formater: 'actions',
                            editable: false,
                            sortable : false,
                            search : false,
                            formatter: function (cellvalue, options, rowobject) {
                                return '<button id="openbtn" onclick="Popup()" >Upload</button>';
                            }
                        },
                        {
                            
                            name: 'webpages_Roles.0.RoleName',
                            index: 'webpages_Roles.0.RoleName',
                            width: 80,
                            sortable: true,
                            
                        },
 
                    ],
                    cellEdit: true,
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
                    loadComplete: function (data) {
                        var newCapture = "",
                            filters, rules, rule, op, i, iOp,s
                            postData = $('#jqg').jqGrid("getGridParam", "postData"),
                            isFiltering = $('#jqg').jqGrid("getGridParam", "search");
 
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
                $("#jqg").jqGrid('filterToolbar', { searchOnEnter: false });
            }
        })
    }
}(jQuery));