$(function() {
    // Setting datatable defaults
    defaultDatatables();
    datatable = $('.datatable-responsive').DataTable({
        ajax: {
            url: '/api/%table%/',
            dataSrc: ''
        },
        columns: '%columns%',
        select: {
            style: 'single',
            info: false
        },
        createdRow: function(row, data) {
            if (data.active) {
                $(row).find('.active').html('<i class="fa fa-check fa-lg" aria-hidden="true" style="color:green"></i>').addClass('text-center');
            } else {
                $(row).find('.active').html('<i class="fa fa-ban fa-lg" aria-hidden="true" style="color:red"></i>').addClass('text-center');
            }
        }
    });
    datatable.on('select', function(e, dt, type, indexes) {
        $('#btnEdit').prop('disabled', false);
        $('#btnDelete').prop('disabled', false);
    }).on('deselect', function() {
        $('#btnEdit').prop('disabled', true);
        $('#btnDelete').prop('disabled', true);
    });
    // Enable Select2 select for the length option
    setTimeout(() => {
        $('.dataTables_length select').select2({
            minimumResultsForSearch: Infinity,
            width: 'auto'
        });
    }, 100);
});