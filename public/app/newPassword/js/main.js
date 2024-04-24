$(function () {

    const parselyOptions = {
        errorClass: 'is-invalid', successClass: 'is-valid', classHandler: function (ParsleyField) {
            return ParsleyField.$element;
        }, errorsWrapper: '<div class="invalid-feedback"></div>', errorTemplate: '<div></div>'
    };

    $('#btnSave').click(async function (e) {
        e.preventDefault();
        try {
            if ($('#crud-form').parsley(parselyOptions).validate()) {
                const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get('p');
                const password = $('#password').val();
                let user = await controller.getUserByToken(token);
                if (user) {
                    let usersPk = user._id;
                    controller.validateForm(function (err) {
                        if (!err) {
                            controller.saveForm(password, usersPk, function (row) {
                                if (row.error) {
                                    $('#btnSave').prop('disabled', false);
                                    global.sendMessage('danger', `<i class="fa fa-info-circle" aria-hidden="true"></i> ${row.info}`);
                                } else {
                                    $('#btnLogin').show('slow');
                                    $('#btnSave').hide();
                                    global.sendMessage('success', '<i class="fa fa-check" aria-hidden="true"></i> Contraseña Modificada con Éxito!');
                                }
                            });
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: 'Token inválido',
                        confirmButtonText: 'Aceptar'
                    });
                }
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                html: `Error creando actividad, contacte a CODESUD.${e}`
            });
        }
    });

    $('#btnLogin').click(async function (e) {
        window.location.href = '/login';
    });

});
