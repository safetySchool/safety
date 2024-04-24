// noinspection TypeScriptUMDGlobal

$(document).ready(function () {
    defaultDatatables();
    // noinspection JSUndeclaredVariable
    datatable = $('#crud-datatable').DataTable({
        'pageLength': 15,
        'ajax': {
            'url': '/api/surveys',
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
            { data: '_id', className: 'id', class: 'text-left' },
            {
                data: 'years', className: 'year', class: 'text-center', render: (years) => {
                    return years.join('-');
                }
            },
            {
                data: 'surveyGraduates',
                className: 'surveyGraduates',
                class: 'text-center',
                render: (surveyGraduates) => {
                    return surveyGraduates.length;
                }
            },
            {
                data: 'createdAt', className: 'createdAt', class: 'text-center', render: function (createdAt) {
                    if (createdAt){
                        return dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss');
                    }
                    return null;
                }
            },
            {
                data: 'surveyGraduates',
                className: 'lastUpdate',
                class: 'text-center',
                render: function (surveyGraduates, type, data) {
                    const dates = surveyGraduates.filter(sg => sg.responseDate !== null).map(sg => sg.responseDate);
                    const sorted = dates.sort(function (a, b) {
                        return new Date(a) - new Date(b);
                    });
                    if (sorted.length > 0) {
                        return dayjs(sorted[0]).format('YYYY-MM-DD HH:mm:ss');
                    }
                    return 'Sin respuestas';
                }
            },
            {
                data: 'surveyGraduates',
                className: 'graduates',
                class: 'text-center',
                render: function (surveyGraduates, type, data) {
                    if (surveyGraduates.length > 0) {
                        return `<a href="/survey/graduates/${data._id}"><i class="fad fa-graduation-cap fa-lg text-success-700 sursor-pointer"></i></a>`;
                    }
                    return '<i class="fad fa-do-not-enter text-danger fa-lg"></i>';
                }
            },
            {
                data: 'closed', className: 'report', class: 'text-center', render: function (closed) {
                    if (!closed) {
                        return '<i class="fad fa-do-not-enter text-danger fa-lg"></i>';
                    }
                    return '<i class="fad fa-file-archive fa-lg text-success-700"></i>';
                }
            },
            {
                data: 'closed', className: 'closed', class: 'text-center', render: function (closed) {
                    if (closed) {
                        return '<i class="fad fa-do-not-enter text-danger fa-lg"></i>';
                    }
                    return '<i class="fad fa-check-circle fa-lg text-success-700"></i>';
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
                    $('#btnEdit').prop('disabled', false);
                    $('#btnClose').prop('disabled', false);
                }
            }).on('deselect', function () {
                if (datatable.rows({ selected: true }).data().toArray().length < 1) {
                    $('#btnEdit').prop('disabled', true);
                    $('#btnClose').prop('disabled', true);
                }
            });
        }
    });
});
