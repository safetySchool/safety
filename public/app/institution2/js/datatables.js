// noinspection TypeScriptUMDGlobal

$(document).ready(function () {
    defaultDatatables();
    // noinspection JSUndeclaredVariable
    datatable = $('#crud-datatable').DataTable({
        'pageLength': 15,
        'ajax': {
            'url': '/api/institution2',
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
            { data: 'name', className: 'name', class: 'text-left' },
            { data: 'address', className: 'address', class: 'text-left' },
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
            }
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
                    const institutionData = datatable.rows({ selected: true }).data().toArray()[0];
                    const InstitutionStatus = institutionData.active;
                    if (InstitutionStatus) {
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
