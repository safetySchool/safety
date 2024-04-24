let controller = {
    async getUserByToken(token) {
        const user = await $.ajax({
            type: 'GET',
            url: '/api/user/token/' + token,
            dataType: 'json',
        });
        return user;
    },
    validateForm: (cb) => {
        let err = false;
        $('.form-password-module :input').each((index, element) => {
            if (String($(element).attr('required')) === 'required') {
                if (!$(element).val() || $(element).val() === null || $(element).val() === '') {
                    $(element).addClass('is-invalid');
                    err = true;
                }
            }
        });
        if ($('#password').val() !== $('#password2').val()) {
            err = true;
            $('#password, #password2').addClass('is-invalid');
            global.sendMessage('danger', 'Contraseñas NO Coinciden!');
        }
        cb(err);
    },
    saveForm: (password, usersPk, cb) => {
        $.ajax({
            url: '/api/users',
            type: 'PATCH',
            data: { _id: usersPk, password: password, token: '' },
            dataType: 'json'
        }).done(function (response) {
            cb(response);
        });
    }
};
