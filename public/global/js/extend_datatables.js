// eslint-disable-next-line no-unused-vars
function defaultDatatables() {
    dayjs.extend(dayjs_plugin_utc);
    $.extend($.fn.dataTable.defaults, {
        bLengthChange: true,
        serverSide: false,
        processing: true,
        bFilter: true,
        bDeferRender: true,
        bInfo: true,
        bSort: true,
        order: [
            [0, 'desc']
        ],
        autoWidth: false,
        responsive: true,
        dom: '<"datatable-header"fl><"datatable-scroll-wrap"t><"datatable-footer"ip>',
        language: {
            sEmptyTable: 'Sin registros',
            sInfo: '&nbsp; Registros del _START_ al _END_ de un total de _TOTAL_',
            sInfoEmpty: 'Mostrando registros del 0 al 0 de un total de 0 registros',
            sInfoFiltered: '(filtrados de un total de _MAX_ registros)',
            lengthMenu: '_MENU_ <span></span>&nbsp;',
            sInfoThousands: ',',
            sLoadingRecords: '<i class="fa fa-fw fa-lg fa-spinner fa-pulse"></i>',
            sProcessing: '<i class="fa fa-fw fa-lg fa-cog fa-spin"></i>',
            search: '_INPUT_',
            sZeroRecords: 'No se encontraron resultados',
            searchPlaceholder: 'Buscar...',
            paginate: { first: 'Primero', last: 'Último', next: $('html').attr('dir') === 'rtl' ? '&larr;' : '&rarr;', 'previous': $('html').attr('dir') === 'rtl' ? '&rarr;' : '&larr;' },
            oAria: {
                sSortAscending: ': Activar para ordenar la columna de manera ascendente',
                sSortDescending: ': Activar para ordenar la columna de manera descendente'
            },
            'lengthMenu': '<select>' +
                '<option value="10">10</option>' +
                '<option value="15">15</option>' +
                '<option value="20">20</option>' +
                '<option value="40">40</option>' +
                '<option value="50">50</option>' +
                '<option value="-1">All</option>' +
                '</select>'
        }
    });
};
