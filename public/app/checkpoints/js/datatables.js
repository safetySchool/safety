// noinspection TypeScriptUMDGlobal
const subcategory = document.currentScript.getAttribute('subcategory');
const category = document.currentScript.getAttribute('category');
const searchId = subcategory ? subcategory : category;

function getSearchId() {
    return searchId;
}

$(document).ready(function () {
    defaultDatatables();
    const subcategory = getSearchId();
    datatable = $('#crud-datatable').DataTable({
        'pageLength': 15,
        'ajax': {
            'type': 'GET',
            'url': '/api/checkpoints/datatables/' + subcategory,
            'dataSrc': '',
            'data': function () {
            }
        },
        select: {
            style: 'single',
            info: false
        },
        bSort: true,
        columns: [
            {
                data: '_id', className: 'id', orderable: false, class: 'text-center', render: function (_id, type) {
                    if (type === 'display') {
                        return `<i class="fas fa-arrow-circle-up fa-lg cursor-pointer" onclick="btnDocumentsClick('` + _id + `');"></i>`;
                    }
                    return null;
                }
            },
            { data: 'position', className: 'position', class: 'text-left' },
            { data: 'type', className: 'action', class: 'text-left' },
            { data: 'description', className: 'description', class: 'text-letf' },
            {
                data: '_id', className: 'id', orderable: false, class: 'text-center', render: function (_id, type) {
                    if (type === 'display') {
                        // alert(_id);
                        return `<i class="fas fa-upload fa-lg cursor-pointer" onclick="controller.openFiles2('` + _id + `');"></i>`;
                    }

                    return null;
                }
            },
            // {
            //     data: 'required', className: 'required', class: 'text-letf',
            //     render: function (required, type) {
            //         if (required) {
            //             return '<span class="badge badge-danger">Requerido</span>';
            //         } else {
            //             return '<span class="badge badge-primary">Opcional</span>';
            //         }
            //     }
            // },
            { data: null, className: 'last_date', class: 'last_date text-center', render: () => '-' },
            { data: null, className: 'validation', class: 'validation text-center', render: () => '-' },
        ],
        columnDefs: [
            { width: '5%', targets: 'id', orderable: false }
        ],
        createdRow: function (row, data) {
            controller.drawLastDate(row, data).then();
            controller.drawValidation(row, data).then();
        },
    });
});

function btndatatableDocuments(_id) {
    datatableDocument = $('#crud-datatable-document').DataTable({
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                text: '<i class="fas fa-file-csv"></i> EXCEL',
                exportOptions: {
                    columns: [0, 1, 2, 3],
                    format: {
                        body: function (data, row, column, node) {
                            if (column === 3) {
                                if (data === '<i class="fas fa-times" style="color: red"></i>') {
                                    return 'No';
                                } else if ('<i class="fas fa-check" style="color: green"></i>') {
                                    return 'Si';
                                }
                                return $(data).text();
                            }
                            return data;
                        },
                    },
                },

            },
            {
                extend: 'pdf',
                text: '<i class="fas fa-file-pdf"></i> PDF',
                exportOptions: {
                    columns: [0, 1, 2, 3],
                    format: {
                        body: function (data, row, column, node) {
                            if (column === 3) {
                                if (data === '<i class="fas fa-times" style="color: red"></i>') {
                                    return 'No';
                                } else if ('<i class="fas fa-check" style="color: green"></i>') {
                                    return 'Si';
                                }
                                return $(data).text();
                            }
                            return data;
                        },
                    },
                },

            },
            {
                extend: 'print',
                text: '<i class="fad fa-print"></i> IMPRIMIR',
                exportOptions: {
                    columns: [0, 1, 2, 3],
                    format: {
                        body: function (data, row, column, node) {
                            if (column === 3) {
                                if (data === '<i class="fas fa-times" style="color: red"></i>') {
                                    return 'No';
                                } else if ('<i class="fas fa-check" style="color: green"></i>') {
                                    return 'Si';
                                }
                                return $(data).text();
                            }
                            return data;
                        },
                    },
                },
            },
        ],
        'pageLength': 15,
        'ajax': {
            'type': 'GET',
            'url': '/api/documents/datatables/' + _id,
            'dataSrc': '',
            'data': function () {
            }
        },
        select: {
            style: 'single',
            info: false
        },
        bSort: true,
        columns: [
            { data: 'typeDocument.name', className: 'typeDocument', class: 'text-left' },
            { data: 'reference', className: 'reference', class: 'text-letf' },
            { data: 'date', className: 'date', class: 'text-letf' },
            {
                data: 'validated', className: 'validated', class: 'text-center', render: function (validated, type) {
                    if (type === 'display') {
                        if (validated) {
                            return '<i class="fas fa-check" style="color: green"></i>';
                        } else {
                            return '<i class="fas fa-times" style="color: red"></i>';
                        }
                    }
                    return null;
                }
            },
            {
                data: '_id', className: 'id', orderable: false, class: 'text-center', render: function (_id, type) {
                    if (type === 'display') {
                        return `<i class="fas fa-upload fa-lg cursor-pointer" onclick="controller.openFiles('` + _id + `');"></i>
                        | <i class="fas fa-pencil fa-lg cursor-pointer" onclick="btnEditClick('` + _id + `')"></i>
                        | <i class="fas fa-trash fa-lg cursor-pointer" onclick="btnDeleteClick('` + _id + `')"></i>`;
                    }
                    return null;
                }
            },
        ],
        columnDefs: [
            { width: '5%', targets: 'id', orderable: false }
        ],
        drawCallback: function (settings) {
        },
        initComplete() {
            $('.dataTables_length select').select2({
                minimumResultsForSearch: Infinity,
                width: 'auto'
            });
            datatableDocument.on('select', function () {
                const profile = globalCredentials.role.name;
                if (profile === 'ADMINISTRADOR' || profile === 'AUDITOR') {
                    if (datatableDocument.rows({ selected: true }).data().toArray().length > 0) {
                        const userData = datatableDocument.rows({ selected: true }).data().toArray()[0];
                        const documentStatus = userData.validated;
                        if (documentStatus) {
                            $('#btnActivate').hide('slow');
                            $('#btnDeactivate').show('slow');
                        } else {
                            $('#btnActivate').show('slow');
                            $('#btnDeactivate').hide('slow');
                        }
                    }
                }
            }).on('deselect', function () {
                const profile = globalCredentials.role.name;
                if (profile === 'ADMINISTRADOR' || profile === 'AUDITOR') {
                    if (datatableDocument.rows({ selected: true }).data().toArray().length < 1) {
                        $('#btnDeactivate').hide('slow');
                        $('#btnActivate').hide('slow');
                    }
                }
            });
        },
        scrollY: '300%',
        scrollX: true,
        scrollCollapse: true,
        fixedColumns: {
            leftColumns: 0,
            rightColumns: 2
        },
    });
}

function btnDatatableFiles(_id) {
    datatableFiles = $('#crud-datatable-files').DataTable({
        'pageLength': 15,
        'ajax': {
            'type': 'GET',
            'url': '/api/documents/files/' + _id,
            'dataSrc': '',
            'data': function () {
            }
        },
        bSort: true,
        columns: [
            { data: 'name', className: 'anme', class: 'text-letf' },
            {
                data: 'path', className: 'path', class: 'text-center', render: function (path, type) {
                    if (type === 'display') {
                        return '<a href="' + path + '" download><i class="fas fa-file-download fa-lg cursor-pointer" title="' + path + '"></i></a>';
                    }
                    return null;
                }
            },
        ],
    });
}
