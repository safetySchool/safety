const mainPasswordModule = function (event, fileOptions) {
    $('#modal-password').on('hidden.bs.modal', function () {
        passwordModuleController.resetModal();
    });

    $('#modal-password').on('shown.bs.modal', function () {
        $('#current-password-module').focus();
    });

    $('#btnSavePasswordModule').click(function () {
        let usersPk = globalCredentials.id;
        passwordModuleController.validateForm(function (err) {
            if (!err) {
                let oldPassword = $('#current-password-module').val();
                let newPassword = $('#new-password-module').val();

                passwordModuleController.matchPassword(oldPassword, usersPk, function (row) {
                    if (!row.isMatch) {
                        $('#current-password-module').addClass('is-invalid');
                        global.sendMessage('danger', 'La contraseña actual no coincide con la registrada en el sistema.');
                    } else {
                        if (row.error) {
                            $('#current-password-module').addClass('is-invalid');
                            $('#current-password-module').focus();
                            $('#current-password-module').select();
                            $('#btnSavePasswordModule').prop('disabled', false);
                            global.sendMessage('danger', `<i class="fa fa-info-circle" aria-hidden="true"></i> ${row.info}`);
                        } else {
                            global.openLoadingModal();
                            passwordModuleController.saveForm(newPassword, usersPk, function (row) {
                                if (row.error) {
                                    $('#current-password-module').addClass('is-invalid');
                                    $('#current-password-module').focus();
                                    $('#btnSavePasswordModule').prop('disabled', false);
                                    global.closeLoadingModal();
                                    global.sendMessage('danger', `<i class="fa fa-info-circle" aria-hidden="true"></i> ${row.info}`);
                                } else {
                                    $('#btnSavePasswordModule, .inputPassModule').attr('disabled', 'disabled');

                                    global.sendMessage('success', '<i class="fa fa-check" aria-hidden="true"></i> Contraseña Modificada con Éxito!');
                                    event.notify({ usersPk });
                                    global.closeLoadingModal();
                                    $('#modal-password').modal('hide');
                                }
                            });
                        }
                    }
                });
            }
        });
    });

    $('.form-password-module :input').click(function () {
        $(this).removeClass('is-invalid');
    });

};
