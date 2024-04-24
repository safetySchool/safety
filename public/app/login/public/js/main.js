var verifyCallback = function(response) {
    if ($.validateRut($('#dni').val())) {
        $('#btnLogin').prop('disabled', false);
    }

};
// eslint-disable-next-line no-unused-vars
var onloadCallback = function() {
    // Renders the HTML element with id 'example1' as a reCAPTCHA widget.
    // The id of the reCAPTCHA widget is assigned to 'widgetId1'.
    widgetId2 = grecaptcha.render(document.getElementById('captcha'), {
        sitekey: '6Ldq-8QZAAAAAC9V-A4xBA3wrrosspiKwHudBvt7',
        callback: verifyCallback
    });
};
$(document).ready(function() {
    controller.loadCategroy();
    $('.select2').select2({
        minimumResultsForSearch: 0,
        minimumInputLength: 0,
        width: 'resolve',
        placeholder: 'Seleccione Opción'
    });
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
    $('#btnRequest').click(function(e) {
        e.preventDefault();
        if (!controller.validateInputs()) {
            if (grecaptcha.getResponse()) {
                $('#loginForm').submit();
            } else {
                alert('Debes validar que no eres un Robot');
            }
        }
    });
    $('.select2').on('select2:select', function(e) {
        $(this).next().find('.select2-selection').removeClass('select2-invalid');
    });
    $('#modalPassword').on('hidden.bs.modal', function() {
        $('#validateRecovery').prop('disabled', true);
        $('#sendRecovery').prop('disabled', true);
        $('#dniRecovery').val('');
        $('#dniRecovery').removeClass('is-invalid');
        $('#helpId').addClass('d-none').removeClass('text-danger').removeClass('text-success').html('');
    });
});