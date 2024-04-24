$(document).ready(function() {

    $('#btnLogin').prop('disabled', true);

    $('#loginForm :input').focus(function() {
        $(this).removeClass('is-invalid');
    });
    $('#dni')
        .click(function() {
            $(this).removeClass('is-invalid');
        })
        .rut({ formatOn: 'blur', validateOn: 'blur' })
        .on('rutInvalido', function() {

            $('#btnLogin').prop('disabled', true);
            $(this).addClass('is-invalid');
            $(this).val('');
        })
        .on('rutValido', function() {
            $('#btnLogin').prop('disabled', false);
        });
    $('#dniRecovery')
        .click(function() {
            $(this).removeClass('is-invalid');
        })
        .rut({ formatOn: 'keyup', validateOn: 'keyup' })
        .on('rutInvalido', function() {
            $('#helpId').removeClass('d-none').addClass('text-danger').html('Rut Inválido');
            $('#validateRecovery').prop('disabled', true);
            $(this).addClass('is-invalid');
            //$(this).val('');
        })
        .on('rutValido', function() {
            $('#helpId').addClass('d-none').removeClass('text-danger').html('');
            $(this).removeClass('is-invalid');
            $('#validateRecovery').prop('disabled', false);
        });
    $('#passwordRecovery').click(function(e) {
        e.preventDefault();
        $('#modalPassword').modal('show');
    });
    $('#validateRecovery').click(function(e) {
        e.preventDefault();
        let dni = $('#dniRecovery').val();
        controller.validateDni({ dni });
    });
    $('#sendRecovery').click(async function(e) {
        e.preventDefault();
        let patientPk = $('#dniRecovery').attr('data-a');
        if (patientPk) {
            let confirm = await controller.confirmRecovery();
            if (confirm.value) {
                let send = await controller.sendRecovery(patientPk);
                $('#modalPassword').modal('hide');
                if (send.error) {
                    Swal.showValidationMessage('Error generando contraseña');
                } else {
                    Swal.fire({ title: 'Contraseña generada con éxito' });
                }
            }
        }
    });
    $('#modalPassword').on('hidden.bs.modal', function() {
        $('#validateRecovery').prop('disabled', true);
        $('#sendRecovery').prop('disabled', true);
        $('#dniRecovery').val('');
        $('#dniRecovery').removeClass('is-invalid');
        $('#helpId').addClass('d-none').removeClass('text-danger').removeClass('text-success').html('');
    });
});