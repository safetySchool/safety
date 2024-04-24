/* eslint-disable */
let savedDocumentModulePassword = false;
let passwordModuleController = {
    resetModal() {
        $('.form-password-module :input').each((index, el) => {
            $(el).val('');
            $(el).removeClass('is-invalid');
        });
        $('#inputPassModule').prop('disabled', false);
        $('.inputPassModule').prop('disabled', false);
        $('#btnSavePasswordModule').prop('disabled', false);
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
        if ($('#new-password-module').val() !== $('#repeat-password-module').val()) {
            err = true;
            $('#new-password-module, #repeat-password-module').addClass('is-invalid');
            global.sendMessage('danger', 'Contraseñas NO Coinciden!');
        }
        cb(err);
    },
    matchPassword: (password, usersPk, cb) => {
        $.ajax({
            url: `/api/users/${usersPk}/password_verify`,
            type: 'GET',
            dataType: 'json',
            data: { password }
        }).done(function(response) {
            cb(response);
        });
    },
    saveForm: (password, usersPk, cb) => {
        $.ajax({
            url: '/api/users',
            type: 'PATCH',
            dataType: 'json',
            data: { _id: usersPk, password }
        }).done(function(response) {
            cb(response);
        });
    }
};
