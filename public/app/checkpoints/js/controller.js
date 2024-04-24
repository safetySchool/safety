let controller = {
    async drawValidation(row, data) {
        const institutionPk = globalCredentials.institution;
        const checkpointPk = data._id;
        const validated = await this.getDocumentValidation(institutionPk, checkpointPk);
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
        const institutionPk = globalCredentials.institution;
        const checkpointPk = data._id;
        const lastMovement = await this.getLastMovementDate(institutionPk, checkpointPk);
        $(row).find('.last_date').text(lastMovement.date);
    },
    getLastMovementDate(institution, checkpoint) {
        return $.ajax({
            type: 'GET',
            url: '/api/documents/getLastMovementDate/' + institution + '/' + checkpoint,
            dataType: 'json'
        });
    },
    getDocumentValidation(institution, checkpoint) {
        return $.ajax({
            type: 'GET',
            url: '/api/documents/getDocumentValidation/' + institution + '/' + checkpoint,
            dataType: 'json'
        });
    },
    saveDocument(data) {
        return $.ajax({
            type: 'POST',
            url: '/api/documents',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        });
    },
    updateDocument(data) {
        return $.ajax({
            type: 'PATCH',
            url: '/api/documents',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        });
    },
    updateDate(data) {
        return $.ajax({
            type: 'PATCH',
            url: '/api/documents/updateDate',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        });
    },
    updateDate2(data) {
        return $.ajax({
            type: 'PATCH',
            url: '/api/helpDocuments/updateDate',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        });
    },
    deleteDocument(data) {
        return $.ajax({
            type: 'DELETE',
            url: '/api/documents',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        });
    },
    openFiles(_id) {
        $('#btnSaveUploadModule').attr('data-type', 'document');
        $('#upload-files-input').fileinput('reset');
        controller.loadPreviewUpload(_id).then();
        $('#modal-upload').attr('data-people', _id);
        $('#modal-upload').modal({ backdrop: 'static', keyboard: false });
    },
    openFiles2(_id) {
        $('#btnSaveUploadModule').attr('data-type', 'help_document');
        $('#upload-files-input').fileinput('reset');
        controller.loadPreviewUpload2(_id).then();
        $('#modal-upload').attr('data-people', _id);
        $('#modal-upload').modal({ backdrop: 'static', keyboard: false });
    },
    uploadDocuments(formData, cb) {
        $.ajax({
            type: 'POST',
            url: '/api/documents/multipart',
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
    uploadDocuments2(formData, cb) {
        $.ajax({
            type: 'POST',
            url: '/api/helpDocuments/multipart',
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
    deleteFileByFilePath(file_path) {
        return $.ajax({
            type: 'DELETE',
            url: '/api/documents/files',
            data: JSON.stringify({ file_path }),
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        });
    },
    async loadTypesDocuments(_id) {
        let typesDocumentsFiltered = "";
        const typesDocuments = await this.getTypesDocuments();
        if (_id === "635c0a89ec42b8735487e1c4") {
            typesDocumentsFiltered = typesDocuments.filter((type) => {
                return type.name === 'Investigación de accidente' ||
                    type.name === 'Medida de control' ||
                    type.name === 'Otros';
            });
        } else {
            typesDocumentsFiltered = typesDocuments.filter((type) => {
                return type.name === 'Certificado' ||
                    type.name === 'Documento' ||
                    type.name === 'Otros';
            });
        }
        $('#typesDocuments').empty();
        for (const typeDocument of typesDocumentsFiltered) {
            $('#typesDocuments').append(`<option value="${typeDocument._id}">${typeDocument.name}</option>`);
        }
    },
    getTypesDocuments() {
        return $.ajax({
            type: 'GET',
            url: '/api/typesDocuments',
            dataType: 'json'
        });
    },
    async getDocumentById(_id) {
        const documents = await this.getDocuments(_id);
        return documents;
    },
    async getDocuments(_id) {
        const documents = await $.ajax({
            type: 'GET',
            url: '/api/documents/' + _id,
            dataType: 'json'
        });
        return documents;
    },
    async loadPreviewUpload(_id) {
        let initialPreview = [],
            initialPreviewConfig = [];
        const files = await this.getFiles(_id);
        files.length === 0 && $('#countDocuments-module').text(files.length).removeClass('bg-danger').addClass('bg-slate');
        files.length > 0 && $('#countDocuments-module').text(files.length).removeClass('bg-slate').addClass('bg-danger');
        for (const [i, doc] of files.entries()) {
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
    },
    async loadPreviewUpload2(_id) {
        let initialPreview = [],
            initialPreviewConfig = [];
        const files = await this.getFilesByCheckPointId(_id);
        files.length === 0 && $('#countDocuments-module').text(files.length).removeClass('bg-danger').addClass('bg-slate');
        files.length > 0 && $('#countDocuments-module').text(files.length).removeClass('bg-slate').addClass('bg-danger');
        for (const [i, doc] of files.entries()) {
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
    },
    getFiles(_id) {
        return $.ajax({
            type: 'GET',
            url: '/api/documents/getDocuments',
            data: { _id: _id },
            dataType: 'json'
        });
    },
    getFilesByCheckPointId(_id) {
        return $.ajax({
            type: 'GET',
            url: '/api/helpDocuments/getDocumentsByCheckPointId',
            data: { _id: _id },
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
    },
    getPercentageByCategoryOrSubcategory(category_or_subcategoty) {
        return $.ajax({
            type: 'GET',
            url: '/chart/getPercentageByCategoryOrSubcategory/' + category_or_subcategoty,
            dataType: 'json'
        });
    }
};
