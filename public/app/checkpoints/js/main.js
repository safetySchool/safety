$(function () {
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
    $('.select2').select2();
    const parselyOptions = {
        errorClass: 'is-invalid', successClass: 'is-valid', classHandler: function (ParsleyField) {
            return ParsleyField.$element;
        }, errorsWrapper: '<div class="invalid-feedback"></div>', errorTemplate: '<div></div>'
    };

    $('#btnCreate').click(function (e) {
        e.preventDefault();
        const _id = $('#btnSave').attr('data-id');
        $('#crud-form').parsley().reset();
        controller.loadTypesDocuments(_id).then(r => console.log(r));
        $('#typesDocuments').val($('#typesDocuments option:first').val()).change();
        $('#date').val(moment().format('YYYY-MM-DD'));
        $('#reference').val('');
        $('#file').val('');
        $('#validationAdmin').hide();
        $('#btnUpdate').hide();
        $('#btnSave').show();
        $('#modal-crud').modal('show');
        $('#modal-datatable-documents').hide();
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
                    checkpoint: _id,
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
                datatableDocument.ajax.reload(null, false);
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                html: `Error creando documento, contacte a CODESUD.${e}`
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
                datatableDocument.ajax.reload(null, false);
            }
        } catch (e) {
            console.log("error: ", e);
            Swal.fire({
                icon: 'error',
                html: 'Error actualizando documento, contacte a CODESUD.'
            });
        }
    });

    $('#btnActivate').click(async function () {
        try {
            if (datatableDocument.rows({ selected: true }).data().toArray().length > 0) {
                let userData = datatableDocument.rows({ selected: true }).data().toArray()[0];
                delete userData.__v;
                delete userData.id;
                const documentStatus = userData.validated;
                userData.typeDocument = userData.typeDocument._id;
                userData.validated = !userData.validated;
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
                            controller.updateDocument(userData);
                            Swal.fire({
                                icon: 'success',
                                text: 'Permiso activado con éxito!'
                            }).then(() => {
                                $("#btnActivate").hide("slow");
                                $("#btnDeactivate").hide("slow");
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
                let userData = datatableDocument.rows({ selected: true }).data().toArray()[0];
                delete userData.__v;
                delete userData.id;
                const documentStatus = userData.validated;
                userData.typeDocument = userData.typeDocument._id;
                userData.validated = !userData.validated;
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
                            controller.updateDocument(userData);
                            Swal.fire({
                                icon: 'success',
                                text: 'Docuemnto sin validación!'
                            }).then(() => {
                                $("#btnDeactivate").hide("slow");
                                $("#btnActivate").hide("slow");
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

function btnDeleteClick(_id) {
    Swal.fire({
        title: '¿Está seguro de eliminar el documento?',
        text: "Esta acción no se puede revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
        if (result.value) {
            const data = {
                _id: _id
            };
            controller.deleteDocument(data);
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
}

function btnEditClick(_idDocument) {
    controller.getDocumentById(_idDocument).then(r => {
        const _id = $('#btnSave').attr('data-id');
        controller.loadTypesDocuments(_id).then(a => {
            $('#typesDocuments').val(r.typeDocument);
        });
        const [day, month, year] = r.date.split("-");
        const date = new Date(year, month - 1, day);
        const dateformatted = moment(date).format('YYYY-MM-DD');
        $('#date').val(dateformatted);
        $('#reference').val(r.reference);
        if (r.validated) {
            $('#validated').prop('checked', true);
        } else {
            $('#validated').prop('checked', false);
        }
        $('#btnUpdate').attr('data-id', _idDocument);
        $('#btnUpdate').show();
        $('#btnSave').hide();
        const profile = globalCredentials.role.name;
        if (profile === 'ADMINISTRADOR') {
            $('#validationAdmin').show();
        }
        $('#modal-crud').modal('show');
        $('#modal-datatable-documents').hide();
    });
}

function btnFilesClick(_id) {
    btnDatatableFiles(_id);
    $('#modal-datatable-files').modal('show');
    $('#modal-datatable-documents').hide();
}

$(document).on('click', '.kv-file-remove', async function () {
    const file_path = $(this).data('key');

    const resp = await controller.deleteFileByFilePath(file_path);

    if (resp) {
        Swal.fire({
            icon: 'success',
            text: 'Archivo eliminado con éxito!'
        });

        $('#modal-upload').modal('hide');
    }
});

function btnDocumentsClick(_id) {
    btndatatableDocuments(_id);
    $('#btnSave').attr('data-id', _id);
    $('#modal-datatable-documents').modal('show');
}

$('#btnSaveUploadModule').click(function (e) {
    try {
        e.preventDefault();
        const type_document = $('#btnSaveUploadModule').attr('data-type');
        let files = $('#upload-files-input').fileinput('getFileStack');
        if (files.length > 0) {
            let people = $('#modal-upload').attr('data-people');
            let formData = new FormData();
            files.forEach((file, i) => {
                formData.append('files', file);
            });
            formData.append('people', people);
            $('#btnSaveUploadModule').html('SUBIENDO <i class="fas fa-spinner fa-spin"></i>');
            $('#btnSaveUploadModule').attr('disabled', 'disabled');

            if (type_document === 'document') {
                controller.uploadDocuments(formData, async function (resp) {
                    $('#btnSaveUploadModule').html('SUBIR <i class="fas fa-upload"></i>');
                    $('#btnSaveUploadModule').removeAttr('disabled');
                    await Swal.fire({
                        icon: 'success',
                        text: 'Documentos almacenados con éxito!'
                    });
                    const _id = formData.get('people');
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
            } else if (type_document === 'help_document') {
                controller.uploadDocuments2(formData, async function (resp) {
                    $('#btnSaveUploadModule').html('SUBIR <i class="fas fa-upload"></i>');
                    $('#btnSaveUploadModule').removeAttr('disabled');
                    await Swal.fire({
                        icon: 'success',
                        text: 'Documentos almacenados con éxito!'
                    });
                    const _id = formData.get('people');
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
        }
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            html: 'Error subiendo documentos, contacte a SOPORTE TÉCNICO.'
        });
    }
});

$('#btnSaveUploadModule2').click(function (e) {
    try {
        e.preventDefault();
        let files = $('#upload-files-input2').fileinput('getFileStack');
        if (files.length > 0) {
            let people = $('#modal-upload2').attr('data-people2');
            let formData = new FormData();
            files.forEach((file, i) => {
                formData.append('files', file);
            });
            formData.append('people', people);
            $('#btnSaveUploadModule2').html('SUBIENDO <i class="fas fa-spinner fa-spin"></i>');
            $('#btnSaveUploadModule2').attr('disabled', 'disabled');
            controller.uploadDocuments2(formData, async function (resp) {
                $('#btnSaveUploadModule2').html('SUBIR <i class="fas fa-upload"></i>');
                $('#btnSaveUploadModule2').removeAttr('disabled');
                await Swal.fire({
                    icon: 'success',
                    text: 'Documentos almacenados con éxito!'
                });
                const _id = formData.get('people');
                $('#date').val(moment().format('YYYY-MM-DD'));
                const date = moment().format('YYYY-MM-DD');
                const dateformatted = moment(date, 'YYYY-MM-DD').format('DD-MM-YYYY');
                const data = {
                    people: _id,
                    date: dateformatted
                };
                await controller.updateDate(data);
                $('#modal-upload2').modal('hide');
            });
        }
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            html: 'Error subiendo documentos, contacte a SOPORTE TÉCNICO.'
        });
    }
});

$('#modal-datatable-documents').on('hidden.bs.modal', function (event) {
    datatable.ajax.reload(null, false);
    datatableDocument.destroy();
});

$('#modal-datatable-files').on('hidden.bs.modal', function (event) {
    datatableFiles.destroy();
    $('#modal-datatable-documents').show();
});

$('#modal-crud').on('hidden.bs.modal', function (event) {
    $('#crud-form').parsley().reset();
    $('#date').val(moment().format('YYYY-MM-DD'));
    $('#reference').val('');
    $('#file').val('');
    $('#validationAdmin').hide();
    $('#modal-datatable-documents').show();
});

$('#modal-upload').on('hidden.bs.modal', function (event) {
    datatableDocument.ajax.reload(null, false);
});

$('#modal-upload').on('hidden.bs.modal', function (event) {
    $('#crud-datatable-document').show();
    $('#modal-datatable-documents').modal('show');
});

async function get_percentage_by_category_or_subcategory() {
    try {
        $('#charts').html(`<h5 class="text-muted text-center">Cargando...</h5>`);
        const category_or_subcategoty = getSearchId();
        const data = await controller.getPercentageByCategoryOrSubcategory(category_or_subcategoty);

        if (data.length > 0) {
            $('#charts').html(`<canvas id="checkpoints-charts"></canvas>`);

            const ctx = document.getElementById('checkpoints-charts');
            const checkpointsCharts = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Completado', 'Pendiente'],
                    datasets: [{
                        data: [data[0], data[1]]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                boxWidth: 10,
                                boxHeight: 10,
                                padding: 10,
                                usePointStyle: true,
                                font: {
                                    size: 12,
                                    family: 'sans-serif',
                                    weight: 'bold',
                                    lineHeight: 1.2,
                                },
                            }
                        }
                    }
                }
            });


            checkpointsCharts.update();
            $("#checkpoints-charts").css("width", "300px");
            $("#checkpoints-charts").css("height", "300px");
            $("#checkpoints-charts").resize();

        }
    } catch (e) {
        console.error(e);
    }
}

get_percentage_by_category_or_subcategory();