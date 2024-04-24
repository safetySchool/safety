$(document).ready(function () {
    defaultDatatables();
    datatable = $('#crud-datatable').DataTable({
        'pageLength': 15,
        'ajax': {
            'type': 'GET',
            'url': '/api/activitiesSafetySchool/datatables',
            'dataSrc': '',
            'data': function () {
            }
        },
        bSort: true,
        select: {
            style: 'single'
        },
        columns: [
            { data: 'name', className: 'name', class: 'text-letf' },
            { data: 'description', className: 'description', class: 'text-left' },
            { data: null, className: 'last_date', render: () => '<center>No hay movimientos</center>' },
            { data: null, className: 'validation', render: () => '<center>Sin documentos</center>' },
            {
                data: '_id', className: 'id', orderable: false, class: 'text-center', render: function (_id, type) {
                    if (type === 'display') {
                        return `<i class="fas fa-upload fa-lg cursor-pointer" onclick="controller.openFiles('` + _id + `');"></i>`;
                    }
                    return null;
                }
            },
        ],
        columnDefs: [
            { width: '5%', targets: 'id', orderable: false }
        ],
        createdRow: function (row, data) {
            controller.drawLastDate(row, data);
            controller.drawValidation(row, data);
        },
        initComplete() {
            $('.dataTables_length select').select2({
                minimumResultsForSearch: Infinity,
                width: 'auto'
            });
        }
    });
});
