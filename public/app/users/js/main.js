$(function () {
    controller.loadRoles().then(r => console.log(r));
    controller.loadInstitutions().then(r => console.log(r));

    $(".select2").select2(
        {
            placeholder: "Seleccione una opción",
            allowClear: true
        }
    );

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
                const login = $('#login').val().toUpperCase();
                const name = $('#name').val().toUpperCase();
                const lastname = $('#lastname').val().toUpperCase();
                const role = $('#role').val();
                const institution = $('#institution').val();
                const email = $('#email').val();
                const data = {
                    login: login,
                    name: name,
                    lastname: lastname,
                    role: role,
                    institution: institution,
                    email: email
                };
                const userData = await controller.saveUser(data);
                Swal.fire({
                    icon: 'success',
                    text: `Usuario creado con contraseña: ${userData.password}`
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
                html: 'Error creando usuario, contacte a CODESUD.'
            });
        }
    });

    $('#btnEdit').click(function (e) {
        e.preventDefault();

        if (datatable.rows({ selected: true }).data().toArray().length > 0) {
            const userData = datatable.rows({ selected: true }).data().toArray()[0];
            $('#login').val(userData.login);
            $('#name').val(userData.name);
            $('#lastname').val(userData.lastname);
            $('#role').val(userData.role._id).trigger('change');
            $('#email').val(userData.email);
            $('#modal-crud').modal('show');
            let institutions = [];
            userData.institution.forEach(i => {
                institutions.push(i._id);
            });
            $('#institution').val(institutions).trigger('change');
            $('#btnUpdate').attr('data-id', userData.id);
            $('#btnUpdate').removeClass('d-none');
            $('#btnSave').addClass('d-none');
        }
    });

    $('#btnUpdate').click(async function (e) {
        e.preventDefault();
        try {
            if ($('#crud-form').parsley(parselyOptions).validate()) {
                const _id = $('#btnUpdate').attr('data-id');
                const login = $('#login').val().toUpperCase();
                const name = $('#name').val().toUpperCase();
                const lastname = $('#lastname').val().toUpperCase();
                const role = $('#role').val();
                const institution = $('#institution').val();
                const email = $('#email').val();
                const data = {
                    _id: _id,
                    login: login,
                    name: name,
                    lastname: lastname,
                    role: role,
                    institution: institution,
                    email: email
                };

                await controller.updateUser(data);
                Swal.fire({ icon: 'success', text: 'Usuario actualizado con éxito!' });
                $('#modal-crud').modal('hide');
                $("#btnActivate").hide("slow");
                $("#btnDeactivate").hide("slow");
                $('#btnEdit').prop('disabled', true);
                datatable.ajax.reload(null, false);
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                html: 'Error actualizando usuario, contacte a CODESUD.'
            });
        }
    });

    $('#btnDeactivate').click(async function () {
        try {
            if (datatable.rows({ selected: true }).data().toArray().length > 0) {
                let userData = datatable.rows({ selected: true }).data().toArray()[0];
                const UserStatus = userData.active;
                userData.active = !userData.active;
                if (UserStatus) {
                    Swal.fire({
                        title: 'Desactivar usuario',
                        text: `¿Está seguro de desactivar el usuario ${userData.login}?`,
                        icon: 'warning',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, desactivar!'
                    }).then((result) => {
                        if (result.value) {
                            const data = {
                                _id: userData.id,
                                login: userData.login,
                                name: userData.name,
                                lastname: userData.lastname,
                                role: userData.role._id,
                                institution: userData.institution._id,
                                email: userData.email,
                                active: userData.active
                            };

                            controller.updateUser(data);
                            Swal.fire({
                                icon: 'success',
                                text: 'Usuario desactivado con éxito!'
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
                        html: 'El usuario ya está desactivado.'
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                html: 'Error desactivando usuario, contacte a CODESUD.'
            });
        }
    });

    $('#btnActivate').click(async function () {
        try {
            if (datatable.rows({ selected: true }).data().toArray().length > 0) {
                let userData = datatable.rows({ selected: true }).data().toArray()[0];
                const UserStatus = userData.active;
                userData.active = !userData.active;

                if (!UserStatus) {
                    Swal.fire({
                        title: 'Activar usuario',
                        text: `¿Está seguro de activar el usuario ${userData.login}?`,
                        icon: 'warning',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, activar!'
                    }).then((result) => {
                        if (result.value) {
                            const data = {
                                _id: userData.id,
                                login: userData.login,
                                name: userData.name,
                                lastname: userData.lastname,
                                role: userData.role._id,
                                institution: userData.institution._id,
                                email: userData.email,
                                active: true
                            };

                            controller.updateUser(data);
                            Swal.fire({
                                icon: 'success',
                                text: 'Usuario activado con éxito!'
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
                        html: 'El usuario ya está activado.'
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                html: 'Error activando usuario, contacte a CODESUD.'
            });
        }
    });

    $('#modal-crud').on('hidden.bs.modal', function (event) {
        $('#crud-form').parsley().reset();
        $('#crud-form').find('input').val('');
        $('#btnUpdate').addClass('d-none');
        $('#btnSave').removeClass('d-none');
        $("#institution").val('').trigger('change');
    });

});
