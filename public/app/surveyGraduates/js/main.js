$(function () {
    controller.loadYears().then();
    $('.select2').select2();
    const parselyOptions = {
        errorClass: 'is-invalid', successClass: 'is-valid', classHandler: function (ParsleyField) {
            return ParsleyField.$element;
        }, errorsWrapper: '<div class="invalid-feedback"></div>', errorTemplate: '<div></div>'
    };
    window.Parsley.addValidator('rut', {
        validateString: function(value) {
            $.validateRut(value) && $('#dni').val($.formatRut(value));
            return $.validateRut(value);
        },
        messages: {
            es: 'Debe ingresar un rut válido'
        }
    });

    $('#btnCreate').click(function (e) {
        e.preventDefault();
        $('#modal-crud').modal('show');
        $('#btnUpdate').addClass('d-none');
        $('#btnSave').removeClass('d-none');
    });

    $('#btnPreview').click(function (e) {
        e.preventDefault();
        window.open('/survey/preview', '_blank', 'noopener');
    });

    $('#btnSave').click(async function (e) {
        e.preventDefault();
        try {
            if ($('#crud-form').parsley(parselyOptions).validate()) {
                const years = $('#years').val();
                await controller.handleSaveSurvey({ years });
                Swal.fire({
                    icon: 'success',
                    text: 'Registro creado con éxito'
                });
                $('#modal-crud').modal('hide');
                datatable.ajax.reload(null, false);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                html: 'Error creando registro, contacte a CODESUD.'
            });
        }
    });
    $('#btnEdit').click(function (e) {
        e.preventDefault();
        if (datatable.rows({ selected: true }).data().toArray().length > 0) {
            const graduateData = datatable.rows({ selected: true }).data().toArray()[0];
            $('#dni').val(graduateData.dni);
            $('#year').val(graduateData.year);
            $('#name').val(graduateData.name);
            $('#lastname').val(graduateData.lastname);
            $('#course').val(graduateData.course._id).trigger('change');
            $('#email').val(graduateData.email);
            $('#phone').val(graduateData.phone);
            $('#modal-crud').modal('show');

            $('#btnUpdate').attr('data-id', graduateData._id);
            $('#btnUpdate').removeClass('d-none');
            $('#btnSave').addClass('d-none');
        }
    });
    $('#btnUpdate').click(async function (e) {
        e.preventDefault();
        try {
            if ($('#crud-form').parsley(parselyOptions).validate()) {
                const id = $('#btnUpdate').attr('data-id');
                const dni = $('#dni').val();
                const year = $('#year').val();
                const name = $('#name').val();
                const lastname = $('#lastname').val();
                const course = $('#course').val();
                const email = $('#email').val();
                const phone = $('#phone').val();
                await controller.updateGraduate({ id, dni, year, phone, name, lastname, course, email });
                Swal.fire({
                    icon: 'success',
                    text: 'Registro actualizado con éxito!'
                });
                $('#modal-crud').modal('hide');
                datatable.ajax.reload(null, false);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                html: 'Error actualizando registro, contacte a CODESUD.'
            });
        }
    });
    $('#btnDelete').click(async function (e) {
        e.preventDefault();
        if (datatable.rows({ selected: true }).data().toArray().length > 0) {
            const graduateData = datatable.rows({ selected: true }).data().toArray()[0];
            let { isConfirmed } = await controller.confirmDeleteGraduate(graduateData);
            if (isConfirmed) {
                await controller.deleteGraduate({ id: graduateData._id });
                Swal.fire({ icon: 'success', text: 'Registro eliminado con éxito!' });
                datatable.ajax.reload(null, false);
            }
        }
    });
    $('#modal-crud').on('hidden.bs.modal', function (e) {
        e.preventDefault();
        $('#crud-form').parsley().reset();
        $('#crud-form').find('input').val('');
        $('#btnUpdate').addClass('d-none');
        $('#btnSave').removeClass('d-none');
    });
});
