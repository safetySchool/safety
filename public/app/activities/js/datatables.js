$(document).ready(function () {
    defaultDatatables();
    const institutionId = globalCredentials.institution;
    datatable = $('#crud-datatable').DataTable({
        'pageLength': 15,
        'ajax': {
            'type': 'GET',
            'url': '/api/activities/datatables/' + institutionId,
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
            {
                data: '_id', className: 'id', orderable: false, class: 'text-center', render: function (_id, type) {
                    if (type === 'display') {
                        return `<i class="fas fa-pencil fa-lg cursor-pointer" onclick="btnEditClick('` + _id + `')"></i>
                        | <i class="fas fa-trash fa-lg cursor-pointer" onclick="btnDeleteClick('` + _id + `')"></i>`;
                    }
                    return null;
                }
            },
        ],
        columnDefs: [
            { width: '5%', targets: 'id', orderable: false }
        ],
    });
});
