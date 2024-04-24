let controller = {
    async drawValidation(row, data) {
        const recordId = data._id;
        const validated = await this.getActivityValidation(recordId);
        let icon = '';
        icon = validated.validated;
        if (validated.validated === true) {
            icon = '<center><i class="fas fa-check" style="color: green"></i></center>';
        } else if (validated.validated === false) {
            icon = '<center><i class="fas fa-times" style="color: red"></i></center>';
        }
        $(row).find('.validation').html(icon);
    },
    async drawLastDate(row, data) {
        const recordId = data._id;
        const lastMovement = await this.getLastMovementDate(recordId);
        console.log({ lastMovement });
        $(row).find('.last_date').html(lastMovement.date);
    },
    async loadCasuistries() {
        const casuistries = await this.getCasuistries();
        $('#casuistries').empty();
        casuistries.map(casuistry => {
            $('#casuistries').append(`<option value="${casuistry._id}">${casuistry.name}</option>`);
        });
    },
    getCasuistries() {
        return $.ajax({
            type: 'GET',
            url: '/api/casuistries/getCasuistries',
            dataType: 'json'
        });
    },
    getLastMovementDate(recordId) {
        return $.ajax({
            type: 'GET',
            url: `/api/accident_movement/getLastMovementDate/${globalCredentials.institution[0]}/${recordId}`,
            dataType: 'json'
        });
    },
    getActivityValidation(recordId) {
        return $.ajax({
            type: 'GET',
            url: `/api/accident_movement/getDocumentValidation/${globalCredentials.institution[0]}/${recordId}`,
            dataType: 'json'
        });
    },
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
            title: `¿Seguro de borrar este accidente correspondiente a ${userData.name}?`,
            html: 'Esta acción no se puede revertir',
            icon: 'info',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: '<i class="fa fa-trash"></i> Borrar',
            confirmButtonAriaLabel: 'Borrar',
            cancelButtonText: 'Cancelar',
            cancelButtonAriaLabel: 'Thumbs down'
        });
    },
    openFiles(people) {
        controller.btndatatableDocuments(_id);
        $('#btnSave').attr('data-id', _id);
        $('#modal-datatable-documents').modal('show');
    },
    uploadDocuments(formData, cb) {
        $.ajax({
            type: 'POST',
            url: '/api/accident/multipart',
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
            url: `/api/accident/${id}`,
            dataType: 'json'
        });
    },
    saveData({ date, dateUp, name, dni, days, cargo, type, casuistry }) {
        return $.ajax({
            type: 'POST',
            url: '/api/accident',
            data: { date, dateUp, name, dni, days, cargo, type, casuistry },
            dataType: 'json'
        });
    },
    updateData({ id, date, dateUp, name, dni, days, cargo, type, casuistry }) {
        return $.ajax({
            type: 'PATCH',
            url: '/api/accident',
            data: { id, date, dateUp, name, dni, days, cargo, type, casuistry },
            dataType: 'json'
        });
    },
    deleteAccident({ id }) {
        return $.ajax({
            type: 'DELETE',
            url: '/api/accident',
            data: { id },
            dataType: 'json'
        });
    },
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
            initialPreviewConfig.push({ type, caption: doc.filename, key: doc.filepath });
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
            url: '/api/accident/getDocuments',
            data: { id: people },
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
