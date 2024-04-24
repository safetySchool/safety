// eslint-disable-next-line no-unused-vars
let controller = {
    async loadRoles() {
        const roles = await this.getRoles();
        $('#role').empty();
        for (const role of roles) {
            $('#role').append(`<option value="${role._id}">${role.name}</option>`);
        }
    },
    async loadInstitutions() {
        const institutions = await this.getInstitutions();
        $('#institution').empty();
        for (const institution of institutions) {
            $('#institution').append(`<option value="${institution._id}">${institution.name}</option>`);
        }
    },
    saveUser(data) {
        return $.ajax({
            type: 'POST',
            url: '/api/users',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        });
    },
    updateUser(data) {
        return $.ajax({
            type: 'PATCH',
            url: '/api/users',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        });
    },
    getInstitutions() {
        return $.ajax({
            type: 'GET',
            url: '/api/institution',
            dataType: 'json'
        });
    },
    getRoles() {
        return $.ajax({
            type: 'GET',
            url: '/api/roles',
            dataType: 'json'
        });
    },
    saveRole(data) {
        return $.ajax({
            type: 'POST',
            url: '/api/roles',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        });
    },
    updateRole(data) {
        return $.ajax({
            type: 'PATCH',
            url: '/api/roles',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        });
    }
};
