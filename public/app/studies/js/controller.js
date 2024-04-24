let controller = {
    async loadRoles() {
        const roles = await this.getRoles();
        $('#role').empty();
        for (const role of roles) {
            $('#role').append(`<option value="${role._id}">${role.name}</option>`);
        }
    },
    async resetPassword(id) {
        console.log({ id });
        let userData = await this.getUserData(id);
        let { isConfirmed } = await controller.confirmResetPassword(userData);
        if (isConfirmed) {
            const { password } = await controller.renewPassword(userData.id);
            let { login, fullname, email } = userData;
            Swal.fire({
                title: 'Enviando Correo',
                html: 'Favor espere...',
                allowEscapeKey: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            await controller.sendMailPassword({ email, password, login, fullname });
            Swal.close();
            Swal.fire({ icon: 'success', text: 'Contraseña generada con éxito!' });
        }
    },
    renewPassword(id) {
        return $.ajax({
            type: 'POST',
            url: '/api/users/newPassword',
            data: { id },
            dataType: 'json'
        });
    },
    sendMailPassword({ email, password, login, fullname }) {
        return $.ajax({
            type: 'POST',
            url: '/api/mail/newpassword',
            data: { email, password, login, fullname },
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
    getRoles() {
        return $.ajax({
            type: 'GET',
            url: '/api/roles',
            dataType: 'json'
        });
    },
    getUserData(id) {
        return $.ajax({
            type: 'GET',
            url: `/api/users/${id}`,
            dataType: 'json'
        });
    },
    saveUser({ login, name, lastname, role, email }) {
        return $.ajax({
            type: 'POST',
            url: '/api/users',
            data: { login, name, lastname, role, email },
            dataType: 'json'
        });
    },
    updateUser({ id, login, name, lastname, role, email }) {
        return $.ajax({
            type: 'PATCH',
            url: '/api/users',
            data: { id, login, name, lastname, role, email },
            dataType: 'json'
        });
    },
    deleteUser({ id }) {
        return $.ajax({
            type: 'DELETE',
            url: '/api/users',
            data: { id },
            dataType: 'json'
        });
    }
};
