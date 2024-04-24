// noinspection TypeScriptUMDGlobal

$(document).ready(function () {
    defaultDatatables();
    // noinspection JSUndeclaredVariable
    const survey = $('#page-content').attr('data-survey');
    datatable = $('#crud-datatable').DataTable({
        'pageLength': 15,
        'ajax': {
            'url': `/api/surveyGraduates/${survey}`,
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
                data: 'graduate', className: 'name', class: 'text-left', render: (graduate) => {
                    return `${graduate.name} ${graduate.lastname}`;
                }
            },
            {
                data: 'graduate',
                className: 'course',
                class: 'text-center',
                render: (graduate) => {
                    return graduate.course.name;
                }
            },
            { data: 'graduate', className: 'year', class: 'text-center', render: (graduate) => {
                return graduate.year;
            } },
            { data: 'responseDate', className: 'responseDate', class: 'text-center',  render: (responseDate) => {
                if (responseDate){
                    return dayjs(responseDate).format('YYYY-MM-DD HH:mm:ss');
                }
                return null;
            } },
            {
                data: null, className: 'view', class: 'text-center', render: function (data) {
                    return `<i class="fad fa-eye fa-lg text-success-700 cursor-pointer" onclick="controller.openSurveyGraduates('${data._id}','${data.graduate._id}', '${data.survey}')"></i>`;
                }
            },
            {
                data: '_id', className: 'viewResponse', class: 'text-center', render: function (id, type, data) {
                    if (data.answered) {
                        return `<i class="fad fa-file-edit fa-lg text-success-700 cursor-pointer" onclick="controller.openResponse('${data._id}')"></i>`;
                    }
                    return '<i class="fad fa-do-not-enter text-danger fa-lg"></i>';
                }
            },
            {
                data: 'answered', className: 'answered', class: 'text-center', render: function (answered) {
                    if (!answered) {
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
