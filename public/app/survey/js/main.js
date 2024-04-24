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
    $('#btnClose').click(async function (e) {
        e.preventDefault();
        if (datatable.rows({ selected: true }).data().toArray().length > 0) {
            const survey = datatable.rows({ selected: true }).data().toArray()[0];
            let { isConfirmed } = await controller.confirmCloseSurvey(survey);
            if (isConfirmed) {
                await controller.closeSurvey({ id: survey._id });
                Swal.fire({ icon: 'success', text: 'Encuesta cerrada con éxito!' });
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
