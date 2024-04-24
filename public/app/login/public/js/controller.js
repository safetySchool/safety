// eslint-disable-next-line no-unused-vars
let controller = {
    validateInputs() {
        let error = false;
        if (!$('#dni').val() || $('#dni').val() === '') {
            error = true;
            $('#dni').addClass('is-invalid');
        }
        if (!$('#email').val() || $('#email').val() === '') {
            error = true;
            $('#email').addClass('is-invalid');
        }
        if (!$('#phone').val() || $('#phone').val() === '') {
            error = true;
            $('#phone').addClass('is-invalid');
        }
        if (!$('#category').val() || $('#category').val() === '') {
            error = true;
            $('#category').next().find('.select2-selection').addClass('select2-invalid');
        }
        return error;
    },
    async validateDni({ dni }) {
        try {
            let validate = await this.getPatientByDni({ dni });
            if (validate.length === 0) {
                this.patientNotRegistered();
            } else {
                let { email, pk: patientPk } = validate[0];
                !email && this.patientNoEmail();
                email && this.allowPatient(email, patientPk);
            }

        } catch (error) {
            console.log(error);
        }
    },
    patientNotRegistered() {
        $('#helpId').removeClass('d-none').addClass('text-danger').html('Paciente no registrado. Para acceder, debe acercarse a recepción del Centro Médico');
        $('#sendRecovery').prop('disabled', true);
    },
    patientNoEmail() {
        $('#helpId').removeClass('d-none').addClass('text-danger').html('Paciente sin correo electrónico. Para solicitar una nueva contraseña, debe acercarse a recepción del Centro Médico');
        $('#sendRecovery').prop('disabled', true);
    },
    async allowPatient(email, patientPk) {
        $('#sendRecovery').prop('disabled', false);
        $('#helpId').removeClass('d-none').addClass('text-success').html(`Haga click en "Recuperar" para recibir su nueva contraseña en el correo: <b>${email}</b>`);

        $('#dniRecovery').attr('data-a', patientPk);
    },
    getPatientByDni({ dni }) {
        return $.ajax({
            type: 'GET',
            url: '/api/patient/byDni',
            data: { dni },
            dataType: 'json'
        });
    },
    sendRecovery(patientPk) {
        return $.ajax({
            url: '/api/patient/recoveryPassword',
            type: 'POST',
            data: { patientPk },
            dataType: 'json'
        });
    },
    confirmRecovery() {
        return Swal.fire({
            title: '¿Segur@ de regenerar su contraseña?',
            text: 'La nueva contraseña le llegará por correo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, generar'
        });
    },
    async loadCategroy() {
        let categories = await this.getCategory();
        let $category = $('#category');
        $category.empty();
        for (const category of categories) {
            var newOption = new Option(category.name, category.name, true, true);
            $category.append(newOption).trigger('change');
        }
        categories.length === 1 && $category.val(categories[0].pk).trigger('change');
        categories.length > 1 && $category.val(null).trigger('change');
    },
    getCategory() {
        return $.ajax({
            type: 'GET',
            url: '/api/category',
            dataType: 'json'
        });
    }
};