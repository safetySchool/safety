$(function () {
    $('.select2').select2();
    const parselyOptions = {
        errorClass: 'is-invalid', successClass: 'is-valid', classHandler: function (ParsleyField) {
            return ParsleyField.$element;
        }, errorsWrapper: '<div class="invalid-feedback"></div>', errorTemplate: '<div></div>'
    };

    $('#btnCreate').click(async function (e) {
        e.preventDefault();
        $('#modal-crud').modal('show');
        $('#btnUpdate').addClass('d-none');
        $('#btnSave').removeClass('d-none');

        $('#region').empty();
        $('#region').append(`<option value="" selected disabled> Selecciona una región </option>`);
        const regionsProvincesCommunes = await regions_provinces_communes();
        regionsProvincesCommunes.forEach(function (x) {
            $('#region').append($('<option>', {
                value: x.region,
                text: x.region
            }));
        });
    });

    $('#btnSave').click(async function (e) {
        e.preventDefault();
        try {
            $('#active').val('true');
            if ($('#crud-form').parsley(parselyOptions).validate()) {
                const name = $('#name').val();
                const region = $('#region').val();
                const province = $('#province').val();
                const commune = $('#commune').val();
                const address = $('#address').val();
                const active = true;
                const phone_number_institution = $('#phone_number_institution').val();
                const email_institution = $('#email_institution').val();
                const maps_link = $('#maps_link').val();
                const data = {
                    name,
                    region,
                    province,
                    commune,
                    address,
                    active,
                    phone_number_institution,
                    email_institution,
                    maps_link
                };

                await controller.saveItem(data);
                Swal.fire({
                    icon: 'success',
                    text: `Registro creado éxito`
                });
                $('#modal-crud').modal('hide');
                $("#btnActivate").hide("slow");
                $("#btnDeactivate").hide("slow");
                $('#btnEdit').prop('disabled', true);
                datatable.ajax.reload(null, false);
            }
        } catch (e) {
            console.log(e);
            Swal.fire({
                icon: 'error',
                html: 'Error creando institución, contacte a CODESUD.'
            });
        }
    });

    $('#btnEdit').click(async function (e) {
        e.preventDefault();
        if (datatable.rows({ selected: true }).data().toArray().length > 0) {
            $('#region').empty();
            $('#region').append(`<option value="" selected disabled> Selecciona una región </option>`);
            const regionsProvincesCommunes = await regions_provinces_communes();
            regionsProvincesCommunes.forEach(function (x) {
                $('#region').append($('<option>', {
                    value: x.region,
                    text: x.region
                }));
            });

            const selectedData = datatable.rows({ selected: true }).data().toArray()[0];
            $('#name').val(selectedData.name);
            $('#address').val(selectedData.address);
            $('#active').val(selectedData.active);
            $('#phone_number_institution').val(selectedData.phone_number_institution);
            $('#email_institution').val(selectedData.email_institution);
            $('#maps_link').val(selectedData.maps_link);

            // set data in select option Nicolas Baeza 16/03/24
            if (selectedData.region) {
                $('#region').val(selectedData.region);
                select_provinces(selectedData.region);
                $('#province').prop('disabled', false);

                if (selectedData.province) {
                    setTimeout(function () {
                        $('#province').val(selectedData.province);
                    }, 800);

                    if (selectedData.commune) {
                        select_communes(selectedData.region, selectedData.province);
                        $('#commune').prop('disabled', false);

                        setTimeout(function () {
                            $('#commune').val(selectedData.commune);
                        }, 500);
                    }
                }
            } else {
                $('#region').val('');
                $('#province').prop('disabled', true);
                $('#commune').prop('disabled', true);
            }

            $('#modal-crud').modal('show');
            $('#btnUpdate').attr('data-id', selectedData._id).removeClass('d-none');
            $('#btnSave').addClass('d-none');
        }
    });

    $('#btnUpdate').click(async function (e) {
        e.preventDefault();
        try {
            if ($('#crud-form').parsley(parselyOptions).validate()) {
                const _id = $('#btnUpdate').attr('data-id');
                const name = $('#name').val();
                const region = $('#region').val();
                const province = $('#province').val();
                const commune = $('#commune').val();
                const address = $('#address').val();
                const phone_number_institution = $('#phone_number_institution').val();
                const email_institution = $('#email_institution').val();
                const contact_name = $('#contact_name').val();
                const level = $('#level').val();
                const supporter = $('#supporter').val();
                const dependence = $('#dependence').val();
                const maps_link = $('#maps_link').val();
                const students = $('#students').val();
                const disability_students = $('#disability_students').val();
                let parent_center = [];
                let name_parent_center = $("input[name='name_parent_center[]']").map(function () {
                    return $(this).val();
                }).get();
                let phone_parent_center = $("input[name='phone_parent_center[]']").map(function () {
                    return $(this).val();
                }).get();
                let email_parent_center = $("input[name='email_parent_center[]']").map(function () {
                    return $(this).val();
                }).get();
                let role_parent_center = $("input[name='role_parent_center[]']").map(function () {
                    return $(this).val();
                }).get();
                let facebook_parent_center = $("input[name='facebook_parent_center[]']").map(function () {
                    return $(this).val();
                }).get();
                let instagram_parent_center = $("input[name='instagram_parent_center[]']").map(function () {
                    return $(this).val();
                }).get();

                for (let i = 0; i < name_parent_center.length; i++) {
                    parent_center = [
                        ...parent_center,
                        {
                            name: name_parent_center[i],
                            phone: phone_parent_center[i],
                            email: email_parent_center[i],
                            role: role_parent_center[i],
                            facebook: facebook_parent_center[i],
                            instagram: instagram_parent_center[i]
                        }
                    ];
                }

                let student_center = [];
                let name_students_center = $("input[name='name_students_center[]']").map(function () {
                    return $(this).val();
                }).get();
                let phone_number_students_center = $("input[name='phone_number_students_center[]']").map(function () {
                    return $(this).val();
                }).get();
                let email_students_center = $("input[name='email_students_center[]']").map(function () {
                    return $(this).val();
                }).get();
                let role_students_center = $("input[name='role_students_center[]']").map(function () {
                    return $(this).val();
                }).get();
                let facebook_students_center = $("input[name='facebook_students_center[]']").map(function () {
                    return $(this).val();
                }).get();
                let instagram_students_center = $("input[name='instagram_students_center[]']").map(function () {
                    return $(this).val();
                }).get();

                for (let i = 0; i < name_students_center.length; i++) {
                    student_center = [
                        ...student_center,
                        {
                            name: name_students_center[i],
                            phone: phone_number_students_center[i],
                            email: email_students_center[i],
                            role: role_students_center[i],
                            facebook: facebook_students_center[i],
                            instagram: instagram_students_center[i]
                        }
                    ];
                }

                const active = $('#active').val();
                await controller.updateItem({
                    _id,
                    name,
                    region,
                    province,
                    commune,
                    address,
                    phone_number_institution,
                    email_institution,
                    contact_name,
                    level,
                    supporter,
                    dependence,
                    maps_link,
                    students,
                    disability_students,
                    parent_center,
                    student_center,
                    active
                });
                Swal.fire({
                    icon: 'success',
                    text: `Registro actualizado con éxito`
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
                html: 'Error actualizando institución, contacte a CODESUD.'
            });
        }
    });

    $('#btnActivate').click(async function () {
        try {
            if (datatable.rows({ selected: true }).data().toArray().length > 0) {
                let institution2Data = datatable.rows({ selected: true }).data().toArray()[0];
                const Institution2Status = institution2Data.active;
                institution2Data.active = !institution2Data.active;
                if (!Institution2Status) {
                    Swal.fire({
                        title: 'Activar institución',
                        text: `¿Está seguro de activar la institución ${institution2Data.name}?`,
                        icon: 'warning',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, activar!'
                    }).then((result) => {
                        if (result.value) {
                            controller.updateItem(institution2Data);
                            Swal.fire({
                                icon: 'success',
                                text: 'Institución activada con éxito!'
                            }).then(() => {
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
                        html: 'La institución ya está desactivada.'
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                html: 'Error activando intitución, contacte a CODESUD.'
            });
        }
    });

    $('#btnDeactivate').click(async function () {
        try {
            if (datatable.rows({ selected: true }).data().toArray().length > 0) {
                let institution2Data = datatable.rows({ selected: true }).data().toArray()[0];
                const Institution2Status = institution2Data.active;
                institution2Data.active = !institution2Data.active;
                if (Institution2Status) {
                    Swal.fire({
                        title: 'Desactivar institución',
                        text: `¿Está seguro de desactivar la institución ${institution2Data.name}?`,
                        icon: 'warning',
                        showCancelButton: true,
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, desactivar!'
                    }).then((result) => {
                        if (result.value) {
                            controller.updateItem(institution2Data);
                            Swal.fire({
                                icon: 'success',
                                text: 'Institución desactivada con éxito!'
                            }).then(() => {
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
                        html: 'La institución ya está desactivada.'
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                html: 'Error desactivando institución, contacte a CODESUD.'
            });
        }
    });

    $('#modal-crud').on('hidden.bs.modal', function (event) {
        $('#crud-form').parsley().reset();
        $('#crud-form').find('input').val('');
        $('#btnUpdate').addClass('d-none');
        $('#btnSave').removeClass('d-none');

        $('#province').empty();
        $('#commune').empty();
        $('#province').prop('disabled', true);
        $('#commune').prop('disabled', true);
    });

    $("#region").on("change", function () {
        $('#province').empty();
        $('#commune').empty();
        $('#province').prop('disabled', false);
        $('#commune').prop('disabled', true);
        const region = $(this).val();
        select_provinces(region);
    });

    $("#province").on("change", function () {
        $('#commune').empty();
        $('#province').prop('disabled', false);
        $('#commune').prop('disabled', false);
        const region = $('#region').val();
        const province = $(this).val();
        select_communes(region, province);
    });

});

async function regions_provinces_communes() {
    const data = await controller.list_regions_provinces_communes();
    return data;
}

async function select_provinces(region) {
    const regionsProvincesCommunes = await regions_provinces_communes();
    regionsProvincesCommunes.forEach(function (x) {
        if (x.region == region) {
            const provinces = x.provincias;
            $('#province').empty();
            $('#province').append(`<option value="" selected disabled> Selecciona una provincia </option>`);
            provinces.forEach(function (p) {
                $('#province').append(`<option value="${p.name}"> ${p.name} </option>`);
            });
        }
    });
}

async function select_communes(region, province) {
    const regionsProvincesCommunes = await regions_provinces_communes();
    regionsProvincesCommunes.forEach(function (x) {
        if (x.region == region) {
            const provinces = x.provincias;
            provinces.forEach(function (p) {
                if (province == p.name) {
                    const communes = p.comunas;
                    $('#commune').empty();
                    $('#commune').append(`<option value="" selected disabled> Selecciona una comuna </option>`);
                    communes.forEach(function (c) {
                        $('#commune').append(`<option value="${c.name}"> ${c.name} </option>`);
                    });
                }
            });
        }
    });
}