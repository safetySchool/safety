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
    $('#btnSaveUploadModule').click(function (e) {
        e.preventDefault();
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
        }
    });

    $('#btnDeactivate').click(async function () {
        try {
            if (datatable.rows({selected: true}).data().toArray().length > 0) {
                let userData = datatable.rows({selected: true}).data().toArray()[0];
                const status = userData.validated;
                if (status) {
                    Swal.fire({
                        title: 'Invalidar actividad',
                        text: `¿Está seguro de invalidar las actividad "${userData.name}"?`,
                        icon: 'warning',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, invalidar!'
                    }).then((result) => {
                        if (result.value) {
                            const data = {
                                _id: userData._id,
                            };
                            controller.validated(data);
                            Swal.fire({
                                icon: 'success',
                                text: 'Actividad invalidada con éxito!'
                            }).then(() => {
                                $("#btnActivate").hide("slow");
                                $("#btnDeactivate").hide("slow");
                                datatable.ajax.reload(null, false);
                            });
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        html: 'La actividad ya está invalidada.'
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                html: 'Error invalidando actividad, contacte a CODESUD.'
            });
        }
    });
    
    $('#modal-datatable-documents').on('hidden.bs.modal', function (event) {
        datatable.ajax.reload(null, false);
        datatableDocument.destroy();
    });
});
