let controller = {
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
    async loadInstitutions(institutionSelected) {
        const userId = globalCredentials._id;
        const user = await this.getInstitutions(userId);
        const institutions = user.institution;
        $('#institution').empty();
        for (const institution of institutions) {
            $('#institution').append(`<option value="${institution._id}">${institution.name}</option>`);
        }
        $('#institution').val('' + institutionSelected);
        $('#institution-update').empty();
        for (const institution of institutions) {
            $('#institution-update').append(`<option value="${institution._id}">${institution.name}</option>`);
        }
    },
    getInstitutions(userId) {
        return $.ajax({
            type: 'GET',
            url: `/api/users-institutionName/${userId}`,
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
