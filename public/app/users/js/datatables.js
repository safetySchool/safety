// noinspection TypeScriptUMDGlobal

$(document).ready(function () {
    defaultDatatables();
    // noinspection JSUndeclaredVariable
    datatable = $('#crud-datatable').DataTable({
        'pageLength': 15,
        'ajax': {
            'url': '/api/users',
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
                data: null, className: 'password', class: 'text-center',
                render: function (data) {
                    return `<i class="fad fa-asterisk fa-lg cursor-pointer" onclick="controller.resetPassword('${data.id}');"></i>`;
                }
            },
            { data: 'name', className: 'name', class: 'text-letf' },
            { data: 'lastname', className: 'lastname', class: 'text-lett' },
            { data: 'email', className: 'email', class: 'text-lett' },
            { data: 'role.name', className: 'role', class: 'text-left' },
            {
                data: 'active', className: 'active', class: 'text-center', render: function (active, type) {
                    if (type === 'display') {
                        if (active) {
                            return `<i class="fas fa-check" fa-lg"</i>`;
                        } else {
                            return `<i class="fas fa-times"></i>`;
                        }
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
            datatable.on('select', function () {
                if (datatable.rows({ selected: true }).data().toArray().length > 0) {
                    const userData = datatable.rows({ selected: true }).data().toArray()[0];
                    const RoleStatus = userData.active;
                    if (RoleStatus) {
                        $('#btnActivate').hide("slow");
                        $('#btnDeactivate').show("slow");
                    } else {
                        $('#btnActivate').show("slow");
                        $('#btnDeactivate').hide('slow');
                    }
                    $('#btnEdit').prop('disabled', false);
                }
            }).on('deselect', function () {
                if (datatable.rows({ selected: true }).data().toArray().length < 1) {
                    $('#btnEdit').prop('disabled', true);
                    $('#btnDeactivate').hide('slow');
                    $('#btnActivate').hide("slow");
                }
            });
        }
    });
});
