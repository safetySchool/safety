$(function () {
    controller.loadPermissions().then(r => console.log(r));
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
            $('#active').val('true');
            if ($('#crud-form').parsley(parselyOptions).validate()) {
                const name = $('#name').val().toUpperCase();
                const permissions = $('#permissions').val();
                const active = $('#active').val();
                const description = $('#description').val().toUpperCase();
                const data = {
                    name: name,
                    permissions: permissions,
                    active: active,
                    description: description
                };
                await controller.saveRole(data);
                Swal.fire({
                    icon: 'success',
                    text: 'Rol creado'
                });
                $('#modal-crud').modal('hide');
                $("#permissions").val([]).change();
                $("#btnActivate").hide("slow");
                $("#btnDeactivate").hide("slow");
                $('#btnEdit').prop('disabled', true);
                datatable.ajax.reload(null, false);
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                html: `Error creando rol, contacte a CODESUD.${e}`
            });
        }
    });

    $('#btnEdit').click(function (e) {
        e.preventDefault();
        if (datatable.rows({ selected: true }).data().toArray().length > 0) {
            const userData = datatable.rows({ selected: true }).data().toArray()[0];
            $('#name').val(userData.name);
            $('#description').val(userData.description);
            let permissions = [];
            userData.permissions.forEach(p => {
                permissions.push(p._id);
            });
            $('#active').val(userData.active);
            $('#permissions').val(permissions).trigger('change');
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
                const name = $('#name').val().toUpperCase();
                const permissions = $('#permissions').val();
                const active = $('#active').val();
                const description = $('#description').val().toUpperCase();
                const data = {
                    _id: _id,
                    name: name,
                    permissions: permissions,
                    active: active,
                    description: description
                };
                await controller.updateRole(data);
                Swal.fire({
                    icon: 'success',
                    text: 'Rol actualizado con éxito!'
                });
                $('#modal-crud').modal('hide');
                $("#permissions").val([]).change();
                $("#btnActivate").hide("slow");
                $("#btnDeactivate").hide("slow");
                $('#btnEdit').prop('disabled', true);
                datatable.ajax.reload(null, false);
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                html: 'Error actualizando rol, contacte a CODESUD.'
            });
        }
    });

    $('#btnDeactivate').click(async function () {
        try {
            if (datatable.rows({ selected: true }).data().toArray().length > 0) {
                let userData = datatable.rows({ selected: true }).data().toArray()[0];
                const RolStatus = userData.active;
                userData.active = !userData.active;
                if (RolStatus) {
                    Swal.fire({
                        title: 'Desactivar rol',
                        text: `¿Está seguro de desactivar el rol ${userData.name}?`,
                        icon: 'warning',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, desactivar!'
                    }).then((result) => {
                        if (result.value) {
                            const data = {
                                _id: userData._id,
                                name: userData.name,
                                description: userData.description,
                                permissions: userData.permissions,
                                active: userData.active
                            };
                            controller.updateRole(data);
                            Swal.fire({
                                icon: 'success',
                                text: 'Rol desactivado con éxito!'
                            }).then(() => {
                                $("#permissions").val([]).change();
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
                        html: 'El rol ya está desactivado.'
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                html: 'Error desactivando rol, contacte a CODESUD.'
            });
        }
    });

    $('#btnActivate').click(async function () {
        try {
            if (datatable.rows({ selected: true }).data().toArray().length > 0) {
                let userData = datatable.rows({ selected: true }).data().toArray()[0];
                const RolStatus = userData.active;
                userData.active = !userData.active;
                if (!RolStatus) {
                    Swal.fire({
                        title: 'Activar rol',
                        text: `¿Está seguro de activar el rol ${userData.name}?`,
                        icon: 'warning',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, activar!'
                    }).then((result) => {
                        if (result.value) {
                            const data = {
                                _id: userData._id,
                                name: userData.name,
                                description: userData.description,
                                permissions: userData.permissions,
                                active: userData.active
                            };
                            controller.updateRole(data);
                            Swal.fire({
                                icon: 'success',
                                text: 'Rol activado con éxito!'
                            }).then(() => {
                                $("#permissions").val([]).change();
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
                        html: 'El rol ya está activado.'
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                html: 'Error activando rol, contacte a CODESUD.'
            });
        }
    });

    $('#modal-crud').on('hidden.bs.modal', function (event) {
        $('#crud-form').parsley().reset();
        $('#crud-form').find('input').val('');
        $('#btnUpdate').addClass('d-none');
        $('#btnSave').removeClass('d-none');
        $("#permissions").val('').trigger('change');
    });
});
