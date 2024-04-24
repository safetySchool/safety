$(function () {
    controller.loadTypesDocuments().then();
    const parselyOptions = {
        errorClass: 'is-invalid', successClass: 'is-valid', classHandler: function (ParsleyField) {
            return ParsleyField.$element;
        }, errorsWrapper: '<div class="invalid-feedback"></div>', errorTemplate: '<div></div>'
    };

    $('.select2').select2();
    let fileOptions = {
        theme: 'fas',
        hideThumbnailContent: true,
        language: 'es',
        showUpload: false,
        browseOnZoneClick: true,
        showCaption: false,
        showUploadedThumbs: false,
        showPreview: true,
        uploadClass: 'd-none',
        browseClass: 'd-none',
        enableResumableUpload: true,
        allowedFileExtensions: []
    };
    $('#upload-files-input').fileinput(fileOptions);

    $('#btnCreate').click(function (e) {
        e.preventDefault();
        $('#crud-form').parsley().reset();
        $('#typesDocuments').val($('#typesDocuments option:first').val()).change();
        $('#date').val(moment().format('YYYY-MM-DD'));
        $('#reference').val('');
        $('#file').val('');
        $('#validationAdmin').hide();
        $('#btnUpdate').hide();
        $('#btnSave').show();
        $('#modal-crud').modal('show');
        $('#modal-datatable-documents').modal('hide');
    });

    $('#btnSave').click(async function (e) {
        e.preventDefault();
        try {
            if ($('#crud-form').parsley(parselyOptions).validate()) {
                const _id = $('#btnSave').attr('data-id');
                const typesDocuments = $('#typesDocuments').val();
                const date = $('#date').val();
                const dateformatted = moment(date, 'YYYY-MM-DD').format('DD-MM-YYYY');
                const reference = $('#reference').val().toUpperCase();
                const institution = globalCredentials.institution;
                const institutionString = institution.toString();
                const data = {
                    referenceId: _id,
                    typeDocument: typesDocuments,
                    date: dateformatted,
                    reference: reference,
                    institution: institutionString,
                };
                await controller.saveDocument(data);
                Swal.fire({
                    icon: 'success',
                    text: 'Documento creado'
                });
                $('#modal-crud').modal('hide');
                //$('#modal-datatable-documents').modal('hide');
                controller.openFiles(_id);
                datatableDocument.ajax.reload(null, false);
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                html: `Error creando documento, contacte a CODESUD.${e.toString()}`
            });
        }
    });

    $('#btnUpdate').click(async function (e) {
        e.preventDefault();
        $('#crud-form').parsley().reset();
        try {
            if ($('#crud-form').parsley(parselyOptions).validate()) {
                const _id = $('#btnUpdate').attr('data-id');
                const typeDocument = $('#typesDocuments').val();
                const date = $('#date').val();
                const dateformatted = moment(date, 'YYYY-MM-DD').format('DD-MM-YYYY');
                const reference = $('#reference').val().toUpperCase();
                const data = {
                    _id: _id,
                    typeDocument: typeDocument,
                    date: dateformatted,
                    reference: reference,
                };
                await controller.updateDocument(data);
                Swal.fire({
                    icon: 'success',
                    text: 'Documento actualizado con éxito!'
                });
                $('#modal-crud').modal('hide');
                $('#modal-datatable-documents').modal('hide');
                datatableDocument.ajax.reload(null, false);
            }
        } catch (e) {
            console.log(e);
            Swal.fire({
                icon: 'error',
                html: 'Error actualizando documento, contacte a CODESUD.'
            });
        }
    });

    $('#btnActivate').click(async function () {
        try {
            if (datatableDocument.rows({ selected: true }).data().toArray().length > 0) {
                let movementData = datatableDocument.rows({ selected: true }).data().toArray()[0];
                const data = {
                    _id: movementData._id,
                    active: true,
                    typeDocument: movementData.typeDocument,
                    files: movementData.files,
                    validated: true,
                    date: movementData.date,
                    reference: movementData.reference
                };
                const documentStatus = movementData.validated;
                if (!documentStatus) {
                    Swal.fire({
                        title: 'Validar documento',
                        text: '¿Está seguro de validar el documento?',
                        icon: 'warning',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, validar!'
                    }).then((result) => {
                        if (result.value) {
                            controller.updateDocument(data);
                            Swal.fire({
                                icon: 'success',
                                text: 'Permiso activado con éxito!'
                            }).then(() => {
                                $('#btnActivate').hide('slow');
                                $('#btnDeactivate').hide('slow');
                                datatableDocument.ajax.reload(null, false);
                            });
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        html: 'El documento ya está validado.'
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                html: 'Error validando documento, contacte a CODESUD.'
            });
        }
    });

    $('#btnDeactivate').click(async function () {
        try {
            if (datatableDocument.rows({ selected: true }).data().toArray().length > 0) {
                let movementData = datatableDocument.rows({ selected: true }).data().toArray()[0];
                const data = {
                    _id: movementData._id,
                    active: true,
                    documentType: movementData.typeDocument._id,
                    files: movementData.files,
                    validated: false,
                    date: movementData.date,
                    reference: movementData.reference
                };
                const documentStatus = movementData.validated;
                if (documentStatus) {
                    Swal.fire({
                        title: 'Quitar validación de documento',
                        text: '¿Está seguro de quitar la validación del documento?',
                        icon: 'warning',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, quitar validación!'
                    }).then((result) => {
                        if (result.value) {
                            controller.updateDocument(movementData);
                            Swal.fire({
                                icon: 'success',
                                text: 'Docuemnto sin validación!'
                            }).then(() => {
                                $('#btnDeactivate').hide('slow');
                                $('#btnActivate').hide('slow');
                                datatableDocument.ajax.reload(null, false);
                            });
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        html: 'El documento ya está sin validación.'
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                html: 'Error quitando validación de documento, contacte a CODESUD.'
            });
        }
    });

    $('#btnSaveUploadModule').click(function (e) {
        e.preventDefault();
        let files = $('#upload-files-input').fileinput('getFileStack');
        if (files.length > 0) {
            let _id = $('#modal-upload').attr('data-id');
            let formData = new FormData();
            files.forEach((file, i) => {
                formData.append('files', file);
            });
            formData.append('_id', _id);
            $('#btnSaveUploadModule').html('SUBIENDO <i class="fas fa-spinner fa-spin"></i>');
            $('#btnSaveUploadModule').attr('disabled', 'disabled');
            controller.uploadDocuments(formData, async function (resp) {
                $('#btnSaveUploadModule').html('SUBIR <i class="fas fa-upload"></i>');
                $('#btnSaveUploadModule').removeAttr('disabled');
                await Swal.fire({
                    icon: 'success',
                    text: 'Documentos almacenados con éxito!'
                });
                const _id = formData.get('_id');
                $('#date').val(moment().format('YYYY-MM-DD'));
                const date = moment().format('YYYY-MM-DD');
                const dateformatted = moment(date, 'YYYY-MM-DD').format('DD-MM-YYYY');
                const data = {
                    people: _id,
                    date: dateformatted
                };
                await controller.updateDate(data);
                $('#modal-upload').modal('hide');
            });
        }
    });

    $('#btnActivate').click(async function () {
        try {
            if (datatableDocument.rows({ selected: true }).data().toArray().length > 0) {
                let movementData = datatableDocument.rows({ selected: true }).data().toArray()[0];
                delete movementData.__v;
                delete movementData.id;
                const documentStatus = movementData.validated;
                movementData.typeDocument = movementData.typeDocument._id;
                movementData.validated = !movementData.validated;
                if (!documentStatus) {
                    Swal.fire({
                        title: 'Validar documento',
                        text: '¿Está seguro de validar el documento?',
                        icon: 'warning',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, validar!'
                    }).then((result) => {
                        if (result.value) {
                            controller.updateDocument(movementData);
                            Swal.fire({
                                icon: 'success',
                                text: 'Permiso activado con éxito!'
                            }).then(() => {
                                $('#btnActivate').hide('slow');
                                $('#btnDeactivate').hide('slow');
                                datatableDocument.ajax.reload(null, false);
                            });
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        html: 'El documento ya está validado.'
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                html: 'Error validando documento, contacte a CODESUD.'
            });
        }
    });

    $('#btnDeactivate').click(async function () {
        try {
            if (datatableDocument.rows({ selected: true }).data().toArray().length > 0) {
                let movementData = datatableDocument.rows({ selected: true }).data().toArray()[0];
                delete movementData.__v;
                delete movementData.id;
                const documentStatus = movementData.validated;
                movementData.typeDocument = movementData.typeDocument._id;
                movementData.validated = !movementData.validated;
                if (documentStatus) {
                    Swal.fire({
                        title: 'Quitar validación de documento',
                        text: '¿Está seguro de quitar la validación del documento?',
                        icon: 'warning',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, quitar validación!'
                    }).then((result) => {
                        if (result.value) {
                            controller.updateDocument(movementData);
                            Swal.fire({
                                icon: 'success',
                                text: 'Docuemnto sin validación!'
                            }).then(() => {
                                $('#btnDeactivate').hide('slow');
                                $('#btnActivate').hide('slow');
                                datatableDocument.ajax.reload(null, false);
                            });
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        html: 'El documento ya está sin validación.'
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                html: 'Error quitando validación de documento, contacte a CODESUD.'
            });
        }
    });
});
