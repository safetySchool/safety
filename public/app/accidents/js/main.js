// noinspection JSJQueryEfficiency

$(function () {
    controller.loadCasuistries().then();
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
                const cargo = $('#cargo').val().toUpperCase();
                const name = $('#name').val().toUpperCase();
                const date = $('#dateAccident').val().toUpperCase();
                const dateUp = $('#dateUp').val().toUpperCase();
                const type = $('#accidentType').val().toUpperCase();
                const casuistry = $('#casuistries').val();
                const days = $('#days').val();
                await controller.saveData({ date, dateUp, name, dni, days, cargo, type, casuistry });
                Swal.fire({
                    icon: 'success',
                    text: 'Registro creado con éxito!',
                });
                $('#modal-crud-people').modal('hide');
                datatable.ajax.reload(null, false);
            }
        } catch (e) {
            console.log(e);
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
            $('#cargo').val(selectedData.cargo || '');
            $('#name').val(selectedData.name);
            $('#accidentType').val(selectedData.type || '');
            $('#casuistries').val(selectedData.casuistry || '');
            $('#dateAccident').val(selectedData.date ? moment(selectedData.date, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD') : '');
            $('#dateUp').val(selectedData.dateUp ? moment(selectedData.dateUp, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD') : '');
            $('#days').val(selectedData.days);

            $('#modal-crud-people').modal('show');
            $('#btnUpdatePeople').attr('data-id', selectedData._id).removeClass('d-none');
            $('#btnSavePeople').addClass('d-none');
        }
    });

    $('#btnUpdatePeople').click(async function (e) {
        e.preventDefault();
        try {
            if ($('#crud-form-people').parsley(parselyOptions).validate()) {
                const id = $('#btnUpdatePeople').attr('data-id');
                const dni = $('#dni').val().toUpperCase();
                const cargo = $('#cargo').val().toUpperCase();
                const name = $('#name').val().toUpperCase();
                const date = $('#dateAccident').val().toUpperCase();
                const dateUp = $('#dateUp').val().toUpperCase();
                const type = $('#accidentType').val().toUpperCase();
                const casuistry = $('#casuistries').val();
                const days = $('#days').val();
                await controller.updateData({ id, date, dateUp, name, dni, days, cargo, type, casuistry });
                Swal.fire({ icon: 'success', text: 'Usuario actualizado con éxito!' });
                $('#modal-crud-people').modal('hide');
                datatable.ajax.reload(null, false);
            }
        } catch (e) {
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
                await controller.deleteAccident({ id: userData.id });
                Swal.fire({ icon: 'success', text: 'Accidente borrado con éxito!' });
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
