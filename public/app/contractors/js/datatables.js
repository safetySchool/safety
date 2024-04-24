// noinspection TypeScriptUMDGlobal

$(document).ready(function () {
    defaultDatatables();
    // noinspection JSUndeclaredVariable
    datatable = $('#crud-datatable').DataTable({
        'pageLength': 15,
        'ajax': {
            'url': '/api/people?type=CONTRACTOR',
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
            { data: 'empresa', className: 'empresa', class: 'text-center', render: data => data ? data : '-' },
            { data: 'rut_empresa', className: 'dni', class: 'text-letf' },
            { data: 'name', className: 'name', class: 'text-letf' },
            { data: 'dni', className: 'dni', class: 'text-left' },
            { data: 'cargo', className: 'cargo', class: 'text-center', render: data => data ? data : '-' },
            { data: 'phone', className: 'phone', class: 'text-left' },
            { data: 'email', className: 'email', class: 'text-left' },
            { data: null, className: 'last_date', class: 'last_date text-center', render: () => 'Sin Movimientos' },
            { data: null, className: 'validation', class: 'validation text-center', render: () => 'Sin movimientos' },
            {
                data: 'files', className: 'files', class: 'text-center', render(files, type, data) {
                    return `<i class="fas fa-upload fa-lg cursor-pointer" onclick="controller.openFiles('${data.id}');">`;
                }
            }
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
            datatable.on('select', function () {
                if (datatable.rows({ selected: true }).data().toArray().length > 0) {
                    $('#btnEditPeople').prop('disabled', false);
                    $('#btnDeletePeople').prop('disabled', false);
                }
            }).on('deselect', function () {
                if (datatable.rows({ selected: true }).data().toArray().length < 1) {
                    $('#btnEditPeople').prop('disabled', true);
                    $('#btnDeletePeople').prop('disabled', true);
                }
            });
        }
    });
});
