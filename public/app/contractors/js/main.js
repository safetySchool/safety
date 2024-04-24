// noinspection JSJQueryEfficiency

$(function () {
    $('input#dni').rut({
        formatOn: 'keyup',
        minimumLength: 8, // validar largo mínimo; default: 2
        validateOn: null // si no se quiere validar, pasar null
    });
    const parselyOptions = {
        errorClass: 'is-invalid', successClass: 'is-valid', classHandler: function (ParsleyField) {
            return ParsleyField.$element;
        }, errorsWrapper: '<div class="invalid-feedback"></div>', errorTemplate: '<div></div>'
    };

    window.Parsley.addValidator('rut', {
        validateString: function (value) {
            return $.validateRut(value);
        },
        messages: {
            en: 'Malformed dni',
            es: 'Rut inválido'
        }
    });

    $('#btnCreatePeople').click(function (e) {
        e.preventDefault();
        $('#modal-crud-people').modal('show');
        $('#btnUpdatePeople').addClass('d-none');
        $('#btnSavePeople').removeClass('d-none');
    });

    $('#btnSavePeople').click(async function (e) {
        e.preventDefault();
        try {
            if ($('#crud-form-people').parsley(parselyOptions).validate()) {
                const dni = $('#dni').val().toUpperCase();
                const name = $('#name').val().toUpperCase();
                const empresa = $('#empresa').val().toUpperCase();
                const rut_empresa = $('#rut_empresa').val();
                const cargo = $('#cargo').val().toUpperCase();
                const phone = $('#phone').val();
                const email = $('#email').val();
                const type = 'CONTRACTOR';
                await controller.saveData({ phone, name, dni, email, type, empresa, rut_empresa, cargo });
                Swal.fire({
                    icon: 'success',
                    text: 'Registro creado con éxito!',
                });
                $('#modal-crud-people').modal('hide');
                datatable.ajax.reload(null, false);
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                html: 'Error creando registro, contacte a CODESUD.'
            });
        }
    });
    $('#btnEditPeople').click(function (e) {
        e.preventDefault();
        if (datatable.rows({ selected: true }).data().toArray().length > 0) {
            const selectedData = datatable.rows({ selected: true }).data().toArray()[0];
            $('#dni').val(selectedData.dni);
            $('#name').val(selectedData.name);
            $('#empresa').val(selectedData.empresa);
            $('#rut_empresa').val(selectedData.rut_empresa);
            $('#cargo').val(selectedData.cargo);
            $('#phone').val(selectedData.phone);
            $('#email').val(selectedData.email);

            $('#modal-crud-people').modal('show');
            $('#btnUpdatePeople').attr('data-id', selectedData.id).removeClass('d-none');
            $('#btnSavePeople').addClass('d-none');
        }
    });
    $('#btnUpdatePeople').click(async function (e) {
        e.preventDefault();
        try {
            if ($('#crud-form-people').parsley(parselyOptions).validate()) {
                const id = $('#btnUpdatePeople').attr('data-id');
                console.log({ id });
                const dni = $('#dni').val().toUpperCase();
                const name = $('#name').val().toUpperCase();
                const cargo = $('#cargo').val().toUpperCase();
                const empresa = $('#empresa').val().toUpperCase();
                const rut_empresa = $('#rut_empresa').val();
                const phone = $('#phone').val();
                const email = $('#email').val();
                await controller.updateData({ id, dni, name, phone, email, empresa, rut_empresa, cargo });
                Swal.fire({ icon: 'success', text: 'Usuario actualizado con éxito!' });
                $('#modal-crud-people').modal('hide');
                datatable.ajax.reload(null, false);
            }
        } catch (e) {
            console.log(e);
            Swal.fire({
                icon: 'error',
                html: 'Error actualizando usuario, contacte a CODESUD.'
            });
        }
    });
    $('#btnDeletePeople').click(async function (e) {
        if (datatable.rows({ selected: true }).data().toArray().length > 0) {
            const userData = datatable.rows({ selected: true }).data().toArray()[0];
            let { isConfirmed } = await controller.confirmDeleteUser(userData);
            if (isConfirmed) {
                await controller.deletePeople({ id: userData.id });
                Swal.fire({ icon: 'success', text: 'Registro eliminado con éxito!' });
                datatable.ajax.reload(null, false);
            }
        }
    });
    $('#modal-crud-people').on('hidden.bs.modal', function () {
        const $modal = $('#crud-form-people');
        $modal.parsley().reset();
        $modal.find('input').val('');
        $('#btnUpdatePeople').addClass('d-none');
        $('#btnSavePeople').removeClass('d-none');
    });
});
