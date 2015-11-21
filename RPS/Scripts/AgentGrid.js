(function ($) {
    $(document).ready(function () {
        loadTable();
    });
    function loadTable() {

        $.ajax({
            url: 'getGridData',
            datatype: "json",
            data: "{}",
            contentType: "application/json; charset=utf-8",
            method: "GET",
            success: function (result) {
                console.log(result);
                $("#jqg").jqGrid({
                    datatype: "local",
                    colNames: ['Id', 'Name', 'Age'],
                    colModel: [
                        {
                            name: 'id',
                            index: 'id',
                            key: true,
                            hidden: false,
                        },
                        {
                            name: 'Login',
                            index: 'Login',
                            width: 150,
                            sortable: true,
                            editable: true
                        },
                        {
                            name: 'IsActive',
                            index: 'IsActive',
                            width: 80,
                            sortable: true,
                            editable: true
                        }
                    ],
                    data: JSON.parse(result),
                    rowNum: 10,
                    autowidth: true,
                    pager: jQuery("#pager"),
                    rowList: [10, 20, 30, 40],
                    viewrecords: true,
                    caption: "RPS",
                    jsonReader: {
                        root: "rows",
                        page: "pages",
                        total: "total",
                        repeatitems: false,
                        id: "0"
                    },
                }).navGrid("#pager", { edit: true, add: true, del: true },
                {
                    beforeShowForm: function (form) {

                    }
                },
                {
                    //edit options
                    zIndex: 100,
                    url: 'Users/EditGridData',
                    closeOnEscape: true,
                    closeAfterEdit: true,
                    recreateForm: true,
                    afterComplete: function (result) {
                    }
                },
                {
                    beforeShowForm: function (form) {
                        var width = $('#gview_jqg').width();
                        var height = $('#gview_jqg').height();
                    }
                },
                //add options
                {
                    zIndex: 100,
                    url: 'Users/AddGridData',
                    closeOnEscape: true,
                    closeAfterEdit: true,
                    afterComplete: function (result) {

                    }
                },
                //delete
                {
                    zIndex: 100,
                    url: 'Users/DeleteGridData',
                    closeOnEscape: true,
                    closeAfterEdit: true,
                    recreateForm: true,
                    msg: "Are you sure ?",
                    afterComplete: function (result) {
                    }
                });
            }
        })
    }
    
}(jQuery));