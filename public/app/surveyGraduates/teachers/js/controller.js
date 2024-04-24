// noinspection JSJQueryEfficiency

let controller = {
    confirmResetPassword(userData) {
        return Swal.fire({
            title: '¿Seguro de re generar la contraseña?',
            html: `Se enviara un correo a ${userData.email}`,
            icon: 'info',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Confirmar!',
            confirmButtonAriaLabel: 'Confirmar',
            cancelButtonText: 'Cancelar',
            cancelButtonAriaLabel: 'Thumbs down'
        });
    },
    confirmDeleteUser(userData) {
        return Swal.fire({
            title: `¿Seguro de eliminar al usuario ${userData.fullname}?`,
            html: 'Esta acción no se puede revertir',
            icon: 'info',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: '<i class="fa fa-trash"></i> Eliminar!',
            confirmButtonAriaLabel: 'Eliminar',
            cancelButtonText: 'Cancelar',
            cancelButtonAriaLabel: 'Thumbs down'
        });
    },
    openFiles(people) {
        $('#upload-files-input').fileinput('reset');

        controller.loadPreviewUpload(people).then();
        $('#modal-upload').attr('data-people', people);
        $('#modal-upload').modal({backdrop: 'static', keyboard: false});
    },
    uploadDocuments(formData, cb) {
        $.ajax({
            type: 'POST',
            url: '/api/people/multipart',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function (response) {
                cb && cb(response);
            }
        });
    },
    getPeopleData(id) {
        return $.ajax({
            type: 'GET',
            url: `/api/people/${id}`,
            dataType: 'json'
        });
    },
    saveData({phone, name, lastname, dni, email, type}) {
        return $.ajax({
            type: 'POST',
            url: '/api/people',
            data: {phone, name, lastname, dni, email, type},
            dataType: 'json'
        });
    },
    updateData({id, phone, name, lastname, dni, email}) {
        return $.ajax({
            type: 'PATCH',
            url: '/api/people',
            data: {id, phone, name, lastname, dni, email},
            dataType: 'json'
        });
    },
    deletePeople({id}) {
        return $.ajax({
            type: 'DELETE',
            url: '/api/people',
            data: {id},
            dataType: 'json'
        });
    },
    //DOCUMNTS
    async loadPreviewUpload(people) {
        let initialPreview = [],
            initialPreviewConfig = [];
        const documents = await this.getDocuments(people);
        documents.length === 0 && $('#countDocuments-module').text(documents.length).removeClass('bg-danger').addClass('bg-slate');
        documents.length > 0 && $('#countDocuments-module').text(documents.length).removeClass('bg-slate').addClass('bg-danger');

        for (const [i, doc] of documents.entries()) {
            let type = this.calculateFileType(doc.fileType);
            let path = doc.filepath;
            initialPreview.push(path);
            initialPreviewConfig.push({type, caption: doc.filename, key: doc.filepath});
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
            initialPreviewAsData: true, // allows you to set a raw markup
            initialPreviewFileType: 'image', // image is the default and can be overridden in config below
            initialPreviewDownloadUrl: `{key}`, // includes the dynamic key tag to be replaced for each config
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
    },
    getDocuments(people) {
        return $.ajax({
            type: 'GET',
            url: '/api/people/getDocuments',
            data: {id: people},
            dataType: 'json'
        });
    },
    calculateFileType(fileType) {
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
    }
};
