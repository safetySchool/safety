$(function () {
    // controller.loadRoles().then(r => console.log(r));
    $('.select2').select2();
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
                const module = $('#module').val().toUpperCase();
                const action = $('#action').val().toUpperCase();
                const description = $('#description').val().toUpperCase();
                const active = true;
                const userData = await controller.savePermission({ module, action, description, active });
                Swal.fire({
                    icon: 'success',
                    text: 'Permiso creado'
                });
                $('#modal-crud').modal('hide');
                $("#btnActivate").hide("slow");
                $("#btnDeactivate").hide("slow");
                $('#btnEdit').prop('disabled', true);
                datatable.ajax.reload(null, false);
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                html: 'Error creando permiso, contacte a CODESUD.'
            });
        }
    });

    $('#btnEdit').click(function (e) {
        e.preventDefault();
        if (datatable.rows({ selected: true }).data().toArray().length > 0) {
            const userData = datatable.rows({ selected: true }).data().toArray()[0];
            $('#module').val(userData.module);
            $('#action').val(userData.action);
            $('#description').val(userData.description);
            $('#modal-crud').modal('show');
            $('#btnUpdate').attr('data-id', userData._id);
            $('#btnUpdate').removeClass('d-none');
            $('#btnSave').addClass('d-none');
        }
    });

    $('#btnUpdate').click(async function (e) {
        e.preventDefault();
        try {
            if ($('#crud-form').parsley(parselyOptions).validate()) {
                const _id = $('#btnUpdate').attr('data-id');
                const module = $('#module').val().toUpperCase();
                const action = $('#action').val().toUpperCase();
                const description = $('#description').val().toUpperCase();
                await controller.updatePermission({ _id, module, action, description });
                Swal.fire({
                    icon: 'success',
                    text: 'Permiso actualizado con éxito!'
                });
                $('#modal-crud').modal('hide');
                $("#btnActivate").hide("slow");
                $("#btnDeactivate").hide("slow");
                $('#btnEdit').prop('disabled', true);
                datatable.ajax.reload(null, false);
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                html: 'Error actualizando permiso, contacte a CODESUD.'
            });
        }
    });

    $('#btnActivate').click(async function () {
        try {
            if (datatable.rows({ selected: true }).data().toArray().length > 0) {
                let userData = datatable.rows({ selected: true }).data().toArray()[0];
                const PermissionStatus = userData.active;
                userData.active = !userData.active;
                if (!PermissionStatus) {
                    Swal.fire({
                        title: 'Activar permiso',
                        text: `¿Está seguro de activar el permiso ${userData.module} - ${userData.action}?`,
                        icon: 'warning',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, activar!'
                    }).then((result) => {
                        if (result.value) {
                            controller.updatePermission(userData);
                            Swal.fire({
                                icon: 'success',
                                text: 'Permiso activado con éxito!'
                            }).then(() => {
                                $("#btnActivate").hide("slow");
                                $("#btnActivate").hide("slow");
                                $("#btnDeactivate").hide("slow");
                                $('#btnEdit').prop('disabled', true);
                                datatable.ajax.reload(null, false);
                            });
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        html: 'El permiso ya está activado.'
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                html: 'Error activando permiso, contacte a CODESUD.'
            });
        }
    });

    $('#btnDeactivate').click(async function () {
        try {
            if (datatable.rows({ selected: true }).data().toArray().length > 0) {
                let userData = datatable.rows({ selected: true }).data().toArray()[0];
                const PermissionStatus = userData.active;
                userData.active = !userData.active;
                if (PermissionStatus) {
                    Swal.fire({
                        title: 'Desactivar permiso',
                        text: `¿Está seguro de desactivar el permiso ${userData.module} - ${userData.action}?`,
                        icon: 'warning',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, desactivar!'
                    }).then((result) => {
                        if (result.value) {
                            controller.updatePermission(userData);
                            Swal.fire({
                                icon: 'success',
                                text: 'Permiso desactivado con éxito!'
                            }).then(() => {
                                $("#btnDeactivate").hide("slow");
                                $("#btnActivate").hide("slow");
                                $("#btnDeactivate").hide("slow");
                                $('#btnEdit').prop('disabled', true);
                                datatable.ajax.reload(null, false);
                            });
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        html: 'El permiso ya está desactivado.'
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                html: 'Error desactivando permiso, contacte a CODESUD.'
            });
        }
    });

    $('#modal-crud').on('hidden.bs.modal', function (event) {
        $('#crud-form').parsley().reset();
        $('#crud-form').find('input').val('');
        $('#btnUpdate').addClass('d-none');
        $('#btnSave').removeClass('d-none');
    });

});
