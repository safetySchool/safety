controller.btndatatableDocuments = (_id) => {
    if ($.fn.DataTable.isDataTable('#crud-datatable-document')) {
        $('#crud-datatable-document').DataTable().destroy();
    }
    datatableDocument = $('#crud-datatable-document').DataTable({
        'pageLength': 15,
        'ajax': {
            'type': 'GET',
            'url': `/api/people_movement/datatables/${_id}`,
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
            { data: 'typeDocument', className: 'typeDocument', class: 'text-left' },
            { data: 'reference', className: 'reference', class: 'text-letf' },
            { data: 'date', className: 'date', class: 'text-letf' },
            {
                data: 'validated', className: 'validated', class: 'text-center', render: function (validated, type) {
                    if (type === 'display') {
                        if (validated) {
                            return '<i class="fas fa-check" style="color: green"></i>';
                        } else {
                            return '<i class="fas fa-times" style="color: red"></i>';
                        }
                    }
                    return null;
                }
            },
            {
                data: '_id', className: 'id', orderable: false, class: 'text-center', render: function (_id, type) {
                    if (type === 'display') {
                        return `<i class="fas fa-upload fa-lg cursor-pointer" onclick="controller.openFilesMovement('` + _id + `');"></i>
                        | <i class="fas fa-pencil fa-lg cursor-pointer" onclick="controller.btnEditClick('` + _id + `')"></i>
                        | <i class="fas fa-trash fa-lg cursor-pointer" onclick="controller.btnDeleteClick('` + _id + `')"></i>`;
                    }
                    return null;
                }
            },
        ],
        columnDefs: [
            { width: '5%', targets: 'id', orderable: false }
        ],
        initComplete() {
            $('.dataTables_length select').select2({
                minimumResultsForSearch: Infinity,
                width: 'auto'
            });
            const profile = globalCredentials.role.name || 'CLIENTE';
            datatableDocument.on('select', function () {
                if (profile === 'ADMINISTRADOR') {
                    if (datatableDocument.rows({ selected: true }).data().toArray().length > 0) {
                        const userData = datatableDocument.rows({ selected: true }).data().toArray()[0];
                        const documentStatus = userData.validated;
                        if (documentStatus) {
                            $('#btnActivate').hide();
                            $('#btnDeactivate').show();
                        } else {
                            $('#btnActivate').show();
                            $('#btnDeactivate').hide();
                        }
                    }
                }
            }).on('deselect', function () {
                if (profile === 'ADMINISTRADOR') {
                    if (datatableDocument.rows({ selected: true }).data().toArray().length < 1) {
                        $('#btnDeactivate').hide();
                        $('#btnActivate').hide();
                    }
                }
            });
        },
        scrollY: '300%',
        scrollX: true,
        scrollCollapse: true,
        fixedColumns: {
            leftColumns: 0,
            rightColumns: 2
        },
    });
};
controller.openFiles = (_id) => {
    controller.btndatatableDocuments(_id);
    $('#btnSave').attr('data-id', _id);
    $('#modal-datatable-documents').modal('show');
};

controller.loadTypesDocuments = async () => {
    $('#typesDocuments').empty();
    const options = ['CONTRATO DE TRABAJO', 'ODI', 'RIOSH', 'ENTREGA ELEMENTOS DE PROTECCION PERSONAL', 'OTROS'];
    for (const option of options) {
        $('#typesDocuments').append(`<option value="${option}">${option}</option>`);
    }
};
controller.getTypesDocuments = () => {
    return $.ajax({
        type: 'GET',
        url: '/api/typesDocuments',
        dataType: 'json'
    });
};

controller.saveDocument = (data) => {
    return $.ajax({
        type: 'POST',
        url: '/api/people_movement',
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
        dataType: 'json'
    });
};

controller.updateDocument = (data) => {
    return $.ajax({
        type: 'PATCH',
        url: '/api/people_movement',
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
        dataType: 'json'
    });
};

controller.getMovementById = async (_id) => {
    return $.ajax({
        type: 'GET',
        url: `/api/people_movement/${_id}`,
        dataType: 'json'
    });
};

controller.btnEditClick = async (_id) => {
    const r = await controller.getMovementById(_id);
    $('#typesDocuments').val(r.typeDocument).change();
    const [day, month, year] = r.date.split('-');
    const date = new Date(year, month - 1, day);
    const dateformatted = moment(date).format('YYYY-MM-DD');
    $('#date').val(dateformatted);
    $('#reference').val(r.reference);
    if (r.validated) {
        $('#validated').prop('checked', true);
    } else {
        $('#validated').prop('checked', false);
    }
    $('#btnUpdate').attr('data-id', _id);
    $('#btnUpdate').show();
    $('#btnSave').hide();
    const profile = globalCredentials.role.name;
    if (profile === 'ADMINISTRADOR') {
        $('#validationAdmin').show();
    }
    $('#modal-crud').modal('show');
    $('#modal-datatable-documents').modal('hide');
};

controller.btnDeleteClick = async (_id) => {
    Swal.fire({
        title: '¿Está seguro de eliminar el documento?',
        text: 'Esta acción no se puede revertir',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!'
    }).then(async (result) => {
        if (result.value) {
            const data = {
                _id: _id
            };
            await controller.deleteDocument(data);
            Swal.fire(
                'Eliminado!',
                'El documento ha sido eliminado.',
                'success'
            ).then((result) => {
                if (result.value) {
                    datatableDocument.ajax.reload(null, false);
                }
            }
            );
        }
    });
    $('#modal-datatable-documents').show();
};

controller.deleteDocument = (data) => {
    return $.ajax({
        type: 'DELETE',
        url: '/api/people_movement',
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
        dataType: 'json'
    });
};

controller.openFilesMovement = (_id) => {
    // $('#modal-datatable-documents').modal('hide');
    $('#upload-files-input').fileinput('reset');
    controller.loadPreviewUpload(_id).then();
    $('#modal-upload').attr('data-id', _id);
    $('#modal-upload').modal({ backdrop: 'static', keyboard: false });
};

controller.getFilesMovement = async (_id) => {
    return $.ajax({
        type: 'GET',
        url: '/api/people_movement/getDocuments',
        data: { _id },
        dataType: 'json'
    });
};

controller.calculateFileType = (fileType) => {
    let type = 'other';
    if (fileType.indexOf('pdf') !== -1) {
        type = 'pdf';
    }
    if (fileType.indexOf('text') !== -1) {
        type = 'text';
    }
    if (fileType.indexOf('image') !== -1) {
        type = 'image';
    }
    return type;
};

controller.uploadDocuments = (formData, cb) => {
    $.ajax({
        type: 'POST',
        url: '/api/people_movement/multipart',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        dataType: 'json',
        success: function (response) {
            cb && cb(response);
        }
    });
};

controller.updateDate = (data) => {
    return $.ajax({
        type: 'PATCH',
        url: '/api/people_movement/updateDate',
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
        dataType: 'json'
    });
};

controller.loadPreviewUpload = async (_id) => {
    let initialPreview = [],
        initialPreviewConfig = [];
    const files = await controller.getFilesMovement(_id);
    files.length === 0 && $('#countDocuments-module').text(files.length).removeClass('bg-danger').addClass('bg-slate');
    files.length > 0 && $('#countDocuments-module').text(files.length).removeClass('bg-slate').addClass('bg-danger');
    for (const [i, doc] of files.entries()) {
        let type = controller.calculateFileType(doc.fileType);
        let path = doc.filepath;
        initialPreview.push(path);
        initialPreviewConfig.push({ type, caption: doc.name, key: i });
    }
    $('#view-files-input').fileinput('destroy');
    $('#view-files-input').fileinput({
        theme: 'fas',
        hideThumbnailContent: false,
        language: 'es',
        showUpload: false,
        dropZoneEnabled: false,
        msgNo: 'Sin documentos adjuntos',
        browseOnZoneClick: false,
        uploadClass: 'd-none',
        browseClass: 'd-none',
        showCaption: false,
        overwriteInitial: false,
        validateInitialCount: true,
        initialPreview,
        initialPreviewAsData: true,
        initialPreviewFileType: 'image',
        initialPreviewDownloadUrl: `{key}`,
        initialPreviewConfig
    });
    $('#kvFileinputModal').css('z-index', 8888);
    $('#view-files-input').on('filebeforedelete', function (jqXHR) {
        return new Promise(function (resolve, reject) {
            swal({
                title: '¿Seguro que desea borrar el documento?',
                text: 'Esta acción no se puede revertir',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, bórralo!',
                cancelButtonText: 'No, Cancelar!',
                confirmButtonClass: 'btn btn-success',
                cancelButtonClass: 'btn btn-danger',
                buttonsStyling: false
            }).then(function (click) {
                if (click.value === true) {
                    resolve();
                    var count = $('#view-files-input').fileinput('getFilesCount');
                    count = count - 1;
                    if (count === 0) {
                        $('#countDocuments-module').text('0').removeClass('bg-danger').addClass('bg-slate');
                    } else {
                        $('#countDocuments-module').text(count);
                    }
                }
            });
        });
    });
};
