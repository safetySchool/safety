// noinspection TypeScriptUMDGlobal

$(document).ready(function () {
    defaultDatatables();
    const institutionId = globalCredentials.institution;
    datatable = $('#crud-datatable').DataTable({
        'pageLength': 15,
        'ajax': {
            'type': 'GET',
            'url': '/api/institution/' + institutionId,
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
            {data: '_id', className: 'id', class: 'text-left'},
            {data: 'name', className: 'name', class: 'text-left'},
            {data: 'phone_number_institution', className: 'phone_number_institution', class: 'text-left'},
            {data: 'email_institution', className: 'email_institution', class: 'text-center', render: (email) => email || ''},
            {data: 'address', className: 'address', class: 'text-left'},
            {data: 'contact_name', className: 'contact_name', class: 'text-letf'},
            {data: 'students', className: 'students', class: 'text-lett'},
            {
                data: 'maps_link',
                className: 'maps_link',
                class: 'text-center',
                render: (maps) => maps ? '<a href="' + maps + '" target="_blank" class="cursor-pointer"><i class="fa fa-map-marker text-green"></i></a>' : '<i class="fa fa-map-marker text-black"></i>'
            },
        ],
        columnDefs: [
            {width: '5%', targets: 'id', orderable: false}
        ],
        createdRow: function (row, data) {
            console.log(data);
        },
        initComplete() {
            $('.dataTables_length select').select2({
                minimumResultsForSearch: Infinity,
                width: 'auto'
            });
            datatable.on('select', function () {
                if (datatable.rows({selected: true}).data().toArray().length > 0) {
                    $('#btnEdit').prop('disabled', false);
                    $('#btnDelete').prop('disabled', false);
                }
            }).on('deselect', function () {
                if (datatable.rows({selected: true}).data().toArray().length < 1) {
                    $('#btnEdit').prop('disabled', true);
                    $('#btnDelete').prop('disabled', true);
                }
            });
        }
    });
});
