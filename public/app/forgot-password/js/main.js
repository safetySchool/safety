$(function () {
    const parselyOptions = {
        errorClass: 'is-invalid', successClass: 'is-valid', classHandler: function (ParsleyField) {
            return ParsleyField.$element;
        }, errorsWrapper: '<div class="invalid-feedback"></div>', errorTemplate: '<div></div>'
    };

    $('#btnSave').click(async function (e) {
        e.preventDefault();
        try {
            $('#btnSave').prop('disabled', true);
            $('#btnSave').html('<i class="fa fa-spinner fa-spin"></i> Enviando');
            if ($('#crud-form').parsley(parselyOptions).validate()) {
                const email = $('#email').val();
                let user = await controller.getUser(email);
                user = user[0];
                const { token } = await controller.createToken(user._id);
                user.token = token;
                delete user.id;
                delete user.superAdmin;
                delete user.__v;
                delete user.fullname;
                const response = await controller.saveUser(user);
                if (response.status === 200) {
                    Swal.fire({
                        title: '¡Éxito!',
                        text: 'Se ha enviado un correo electrónico a su cuenta de correo electrónico con las instrucciones para restablecer su contraseña.',
                        type: 'success',
                        confirmButtonText: 'Aceptar'
                    });
                    $('#btnSave').prop('disabled', false);
                    $('#btnSave').html('Recuperar Contraseña');
                    $('#crud-form').parsley().reset();
                    $('#crud-form')[0].reset();
                } else {
                    Swal.fire({
                        title: '¡Error!',
                        text: 'No se pudo enviar el correo electrónico.',
                        type: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                    $('#btnSave').prop('disabled', false);
                    $('#btnSave').html('Recuperar Contraseña');
                    $('#crud-form').parsley().reset();
                    $('#crud-form')[0].reset();
                }

            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                html: `Error creando actividad, contacte a CODESUD.${e}`
            });
        }
    });
});
