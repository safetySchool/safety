// eslint-disable-next-line no-unused-vars
let controller = {
    btnDataTable(_id) {
        return $.ajax({
            type: 'GET',
            url: '/api/roles/' + _id,
            dataType: 'json'
        }).done(function (data) {
            let permissions = data.permissions;
            let permissionList = [];
            $('#permissionsUl').empty();
            for (let i = 0; i < permissions.length; i++) {
                permissionList.push(permissions[i].module);
                $('#permissionsUl').append(`<li class="list-group-item">- ${permissionList[i]}</li>`);
            }
            $('#modal-info').modal('show');
        }
        );
    },
    async loadPermissions() {
        const permissions = await this.getPermissions();
        $('#permissions').empty();
        for (const permission of permissions) {
            $('#permissions').append(`<option value="${permission._id}">${permission.module} - ${permission.action}</option>`);
        }
    },
    getPermissions() {
        return $.ajax({
            type: 'GET',
            url: '/api/permissions',
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
