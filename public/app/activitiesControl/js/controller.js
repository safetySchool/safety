let controller = {
    async drawValidation(row, data) {
        const activityPk = data._id;
        const validated = await this.getActivityValidation(activityPk);
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
        const activityPk = data._id;
        const lastMovement = await this.getLastMovementDate(activityPk);
        $(row).find('.last_date').html(lastMovement.date);
    },
    getLastMovementDate(activityPk) {
        return $.ajax({
            type: 'GET',
            url: `/api/activities_movement/getLastMovementDate/${globalCredentials.institution}/${activityPk}`,
            dataType: 'json'
        });
    },
    getActivityValidation(activity) {
        return $.ajax({
            type: 'GET',
            url: `/api/activities_movement/getDocumentValidation/${globalCredentials.institution}/${activity}`,
            dataType: 'json'
        });
    },
    openFiles(_id) {
        this.btndatatableDocuments(_id);
        $('#btnSave').attr('data-id', _id);
        $('#modal-datatable-documents').modal('show');
    },
    uploadDocuments(formData, cb) {
        $.ajax({
            type: 'POST',
            url: '/api/activities/multipart',
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
    getFiles(_id) {
        return $.ajax({
            type: 'GET',
            url: '/api/activities/getActivities',
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
    updateDate(data) {
        return $.ajax({
            type: 'PATCH',
            url: '/api/activities/updateDate',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        });
    },
    validated(data) {
        return $.ajax({
            type: 'PATCH',
            url: '/api/activities/validated',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        });
    },
};
