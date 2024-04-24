$(document).ready(function () {
    defaultDatatables();
    // obtener la institución del usuario
    const institution = globalCredentials.institution;
    datatable = $('#crud-datatable').DataTable({
        'pageLength': 15,
        'ajax': {
            'type': 'GET',
            'url': '/api/activities/datatables/' + institution,
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
            { data: 'name', className: 'position', class: 'text-left' },
            { data: 'institution.name', className: 'institution', class: 'text-left' },
            { data: 'description', className: 'description', class: 'text-letf' },
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
