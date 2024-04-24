// noinspection TypeScriptUMDGlobal

$(document).ready(function () {
    defaultDatatables();
    // noinspection JSUndeclaredVariable
    datatable = $('#crud-datatable').DataTable({
        'pageLength': 15,
        'ajax': {
            'url': '/api/graduates',
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
            { data: 'id', className: 'id', class: 'text-left' },
            { data: 'year', className: 'year', class: 'text-left' },
            { data: 'course.name', className: 'role', class: 'text-left' },
            { data: 'dni', className: 'dni', class: 'text-letf' },
            { data: 'name', className: 'name', class: 'text-letf' },
            { data: 'lastname', className: 'lastname', class: 'text-left' },
            { data: 'email', className: 'email', class: 'text-left' },
            { data: 'phone', className: 'phone', class: 'text-left' }
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
            datatable.on('select', function () {
                if (datatable.rows({ selected: true }).data().toArray().length > 0) {
                    $('#btnEdit').prop('disabled', false);
                    $('#btnDelete').prop('disabled', false);
                }
            }).on('deselect', function () {
                if (datatable.rows({ selected: true }).data().toArray().length < 1) {
                    $('#btnEdit').prop('disabled', true);
                    $('#btnDelete').prop('disabled', true);
                }
            });
        }
    });
});
