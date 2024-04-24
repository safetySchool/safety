// noinspection JSJQueryEfficiency

$(function () {
    let fileOptions = {
        theme: 'fas',
        hideThumbnailContent: true,
        language: 'es',
        showUpload: false,
        browseOnZoneClick: true,
        showCaption: false,
        showUploadedThumbs: false,
        showPreview: true,
        uploadClass: 'd-none',
        browseClass: 'd-none',
        enableResumableUpload: true,
        allowedFileExtensions:  []
    };
    $('#upload-files-input').fileinput(fileOptions);
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
                const dni = $('#dni').val().toUpperCase();
                const name = $('#name').val().toUpperCase();
                const lastname = $('#lastname').val().toUpperCase();
                const phone = $('#phone').val();
                const email = $('#email').val();
                const type = 'TEACHER';
                await controller.saveData({phone, name, lastname, dni, email, type});
                Swal.fire({
                    icon: 'success',
                    text: 'Registro creado con éxito!',
                });
                $('#modal-crud').modal('hide');
                datatable.ajax.reload(null, false);
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                html: 'Error creando registro, contacte a CODESUD.'
            });
        }
    });
    $('#btnEdit').click(function (e) {
        e.preventDefault();
        if (datatable.rows({selected: true}).data().toArray().length > 0) {
            const selectedData = datatable.rows({selected: true}).data().toArray()[0];
            $('#dni').val(selectedData.dni);
            $('#name').val(selectedData.name);
            $('#lastname').val(selectedData.lastname);
            $('#phone').val(selectedData.phone);
            $('#email').val(selectedData.email);

            $('#modal-crud').modal('show');
            $('#btnUpdate').attr('data-id', selectedData.id).removeClass('d-none');
            $('#btnSave').addClass('d-none');
        }
    });
    $('#btnUpdate').click(async function (e) {
        e.preventDefault();
        try {
            if ($('#crud-form').parsley(parselyOptions).validate()) {
                const id = $('#btnUpdate').attr('data-id');
                const dni = $('#dni').val().toUpperCase();
                const name = $('#name').val().toUpperCase();
                const lastname = $('#lastname').val().toUpperCase();
                const phone = $('#phone').val();
                const email = $('#email').val();
                await controller.updateData({id, dni, name, lastname, phone, email});
                Swal.fire({icon: 'success', text: 'Usuario actualizado con éxito!'});
                $('#modal-crud').modal('hide');
                datatable.ajax.reload(null, false);
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                html: 'Error actualizando usuario, contacte a CODESUD.'
            });
        }
    });
    // $('#btnDelete').click(async function (e) {
    //     if (datatable.rows({ selected: true }).data().toArray().length > 0) {
    //         const userData = datatable.rows({ selected: true }).data().toArray()[0];
    //         let { isConfirmed } = await controller.confirmDeleteUser(userData);
    //         if (isConfirmed) {
    //             await controller.deleteUser({ id: userData.id });
    //             Swal.fire({ icon: 'success', text: 'Usuario eliminado con éxito!' });
    //             datatable.ajax.reload(null, false);
    //         }
    //     }
    // });
    $('#modal-crud').on('hidden.bs.modal', function () {
        const $modal = $('#crud-form');
        $modal.parsley().reset();
        $modal.find('input').val('');
        $('#btnUpdate').addClass('d-none');
        $('#btnSave').removeClass('d-none');
    });

    $('#btnSaveUploadModule').click(function(e) {
        e.preventDefault();
        let files = $('#upload-files-input').fileinput('getFileStack');
        if (files.length > 0) {
            let people = $('#modal-upload').attr('data-people');
            let formData = new FormData();
            files.forEach((file, i) => {
                formData.append('files', file);
            });
            formData.append('people', people);
            $('#btnSaveUploadModule').html('SUBIENDO <i class="fas fa-spinner fa-spin"></i>');
            $('#btnSaveUploadModule').attr('disabled', 'disabled');
            controller.uploadDocuments(formData, async function(resp) {
                $('#btnSaveUploadModule').html('SUBIR <i class="fas fa-upload"></i>');
                $('#btnSaveUploadModule').removeAttr('disabled');
                await Swal.fire({
                    icon: 'success',
                    text: 'Documentos almacenados con éxito!'
                });
                $('#modal-upload').modal('hide');
            });
        }
    });
});
