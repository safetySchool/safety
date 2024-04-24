$(function () {
    const parselyOptions = {
        errorClass: 'is-invalid', successClass: 'is-valid', classHandler: function (ParsleyField) {
            return ParsleyField.$element;
        }, errorsWrapper: '<div class="invalid-feedback"></div>', errorTemplate: '<div></div>'
    };

    $('#btnCreate').click(function (e) {
        e.preventDefault();
        $('#modal-crud').modal('show');
        $('#btnUpdate').addClass('d-none');
        $('#btnSave').removeClass('d-none');
    });

    $('#btnSave').click(async function (e) {
        e.preventDefault();
        try {
            if ($('#crud-form').parsley(parselyOptions).validate()) {
                const name = $('#name').val().toUpperCase();
                await controller.saveCourse({ name });
                Swal.fire({
                    icon: 'success',
                    text: 'Carrera creada con éxito'
                });
                $('#modal-crud').modal('hide');
                datatable.ajax.reload(null, false);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                html: 'Error creando carrera, contacte a CODESUD.'
            });
        }
    });
    $('#btnEdit').click(function (e) {
        e.preventDefault();
        if (datatable.rows({ selected: true }).data().toArray().length > 0) {
            const courseData = datatable.rows({ selected: true }).data().toArray()[0];
            $('#name').val(courseData.name);
            $('#modal-crud').modal('show');

            $('#btnUpdate').attr('data-id', courseData._id);
            $('#btnUpdate').removeClass('d-none');
            $('#btnSave').addClass('d-none');
        }
    });
    $('#btnUpdate').click(async function (e) {
        e.preventDefault();
        try {
            if ($('#crud-form').parsley(parselyOptions).validate()) {
                const id = $('#btnUpdate').attr('data-id');
                const name = $('#name').val().toUpperCase();
                await controller.updateCourse({ id, name });
                Swal.fire({
                    icon: 'success',
                    text: 'Carrera actualizada con éxito!'
                });
                $('#modal-crud').modal('hide');
                datatable.ajax.reload(null, false);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                html: 'Error actualizando carrera, contacte a CODESUD.'
            });
        }
    });
    $('#btnDelete').click(async function (e) {
        e.preventDefault();
        if (datatable.rows({ selected: true }).data().toArray().length > 0) {
            const courseData = datatable.rows({ selected: true }).data().toArray()[0];
            let { isConfirmed } = await controller.confirmDeleteCourse(courseData);
            if (isConfirmed) {
                await controller.deleteCourse({ id: courseData._id });
                Swal.fire({ icon: 'success', text: 'Carrera eliminada con éxito!' });
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
