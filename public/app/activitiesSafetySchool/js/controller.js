let controller = {
    async drawValidation(row, data) {
        const activitySafetySchoolPk = data._id;
        const validated = await this.getActivityValidation(activitySafetySchoolPk);
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
        const activitySafetySchoolPk = data._id;
        const lastMovement = await this.getLastMovementDate(activitySafetySchoolPk);
        $(row).find('.last_date').html(lastMovement.date);
    },
    getLastMovementDate(activitySafetySchoolPk) {
        return $.ajax({
            type: 'GET',
            url: `/api/activitiesSafetySchool_movement/getLastMovementDate/${activitySafetySchoolPk}`,
            dataType: 'json'
        });
    },
    getActivityValidation(activitySafetySchool) {
        return $.ajax({
            type: 'GET',
            url: `/api/activitiesSafetySchool_movement/getDocumentValidation/${activitySafetySchool}`,
            dataType: 'json'
        });
    },
    async getActivityById(_id) {
        const activities = await this.getActivities(_id);
        return activities;
    },
    async getActivities(_id) {
        const activities = await $.ajax({
            type: 'GET',
            url: '/api/activities/' + _id,
            dataType: 'json'
        });
        return activities;
    },
    saveActivity(data) {
        return $.ajax({
            type: 'POST',
            url: '/api/activities',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        });
    },
    async loadInstitutions() {
        const institutions = await this.getInstitutions();
        $('#institution').empty();
        $('#filterInstitution').empty();
        $('#filterInstitution').append('<option value="">-- TODOS --</option>');
        for (const institution of institutions) {
            $('#institution').append(`<option value="${institution._id}">${institution.name}</option>`);
            $('#filterInstitution').append(`<option value="${institution._id}">${institution.name}</option>`);
        }
    },
    getInstitutions() {
        return $.ajax({
            type: 'GET',
            url: '/api/institution',
            dataType: 'json'
        });
    },
    async getActivityById(_id) {
        const activities = await this.getActivities(_id);
        return activities;
    },
    async getActivities(_id) {
        const activities = await $.ajax({
            type: 'GET',
            url: '/api/activities/' + _id,
            dataType: 'json'
        });
        return activities;
    },
    openFiles(_id) {
        this.btndatatableDocuments(_id);
        $('#btnSave').attr('data-id', _id);
        $('#modal-datatable-documents').modal('show');
    },
    updateActivity(data) {
        return $.ajax({
            type: 'PATCH',
            url: '/api/activities',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        });
    },
    deleteActivity(data) {
        return $.ajax({
            type: 'DELETE',
            url: '/api/activities',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        });
    },
};
