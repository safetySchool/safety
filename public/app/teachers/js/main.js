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
                const cargo = $('#cargo').val().toUpperCase();
                const name = $('#name').val().toUpperCase();
                const lastname = $('#lastname').val().toUpperCase();
                const phone = $('#phone').val();
                const email = $('#email').val();
                const type = 'TEACHER';
                await controller.saveData({ phone, name, lastname, dni, email, type, cargo });
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
            $('#cargo').val(selectedData.cargo || '');
            $('#name').val(selectedData.name);
            $('#lastname').val(selectedData.lastname);
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
                const dni = $('#dni').val().toUpperCase();
                const cargo = $('#cargo').val().toUpperCase();
                const name = $('#name').val().toUpperCase();
                const lastname = $('#lastname').val().toUpperCase();
                const phone = $('#phone').val();
                const email = $('#email').val();
                await controller.updateData({ id, dni, name, lastname, phone, email, cargo });
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

    $('#modal-datatable-documents').on('hidden.bs.modal', function () {
        datatable.ajax.reload(null, false);
    });
});

$('#btnLoadPeople').click(function (e) {
    e.preventDefault();
    $('#modal-carga-masiva').modal('show');
    // $('#btnCargarTeachers').addClass('d-none');
});

$('#download_excel_staff').click(function (e) {
    e.preventDefault();
    window.location.href = '/public/uploads/documents/staff.xlsx';
});

$('#btnCargarTeachers').click(async function (e) {
    e.preventDefault();

    const file = $('#document').prop('files')[0];
    const fileExtension = file.name.split('.').pop();

    if (fileExtension !== 'xlsx') {
        Swal.fire({
            icon: 'error',
            text: 'El archivo no es un excel (.xlsx).',
            confirmButtonText: 'Ok'
        });
    } else {
        const formData = new FormData();
        formData.append('file', file);
        try {
            await controller.uploadFile(formData);
            Swal.fire({
                icon: 'success',
                text: 'Carga masiva realizada con éxito!',
                confirmButtonText: 'Ok'
            });
            $('#modal-carga-masiva').modal('hide');
            datatable.ajax.reload(null, false);
        } catch (e) {
            Swal.fire({
                icon: 'error',
                text: 'Error al cargar archivo, contacte a SOPORTE TÉCNICO.',
                confirmButtonText: 'Ok'
            });
            console.error("error: ", e);
        }
    }








    // const file = $('#file').prop('files')[0];
    // if (file) {
    //     try {
    //         const formData = new FormData();
    //         formData.append('file', file);
    //         await controller.uploadFile(formData);
    //         Swal.fire({ icon: 'success', text: 'Carga masiva realizada con éxito!' });
    //         $('#modal-carga-masiva').modal('hide');
    //     } catch (e) {
    //         Swal.fire({ icon: 'error', text: 'Error al cargar archivo, contacte a CODESUD.' });
    //     }
    // } else {
    //     Swal.fire({ icon: 'error', text: 'Seleccione un archivo para cargar.' });
    // }
});