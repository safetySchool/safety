$(function () {
    $('.select2').select2();
    const parselyOptions = {
        errorClass: 'is-invalid', successClass: 'is-valid', classHandler: function (ParsleyField) {
            return ParsleyField.$element;
        }, errorsWrapper: '<div class="invalid-feedback"></div>', errorTemplate: '<div></div>'
    };

    $(document).on('click', '.btnDelete', function (e) {
        const institution_id = $(this).data('id');
        const user_id = globalCredentials._id;

        Swal.fire({
            title: '¿Está seguro de borrar la institución?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Si, borrar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await controller.removeInstitutionFromUser(user_id, institution_id);
                Swal.fire('Borrado!', 'El registro ha sido borrado.', 'success');
                getInstitutions();
            }
        });
    });

    $(document).on('click', '.btnEdit', async function (e) {
        e.preventDefault();

        const id = $(this).data('id');
        const institution = await controller.getInstitution(id);
        const data = institution[0];

        $('#name').val(data.name);
        $('#address').val(data.address);
        $('#phone_number_institution').val(data.phone_number_institution);
        $('#email_institution').val(data.email_institution);
        $('#web_site').val(data.web_site);
        $('#contact_name').val(data.contact_name);

        let levels = [];
        data.level.forEach(l => {
            levels.push(l);
        });

        $('#level').val(levels).trigger('change');
        $('#supporter').val(data.supporter);
        $('#dependence').val(data.dependence).trigger('change');
        $('#maps_link').val(data.maps_link);
        $('#students').val(data.students);
        $('#disability_students').val(data.disability_students);
        const parents_center = data.parents_center;
        const students_center = data.students_center;

        if (parents_center.length > 0) {
            let contador_parents_center = 1;
            for (let index = 0; index < parents_center.length; index++) {
                contador_parents_center > 1 && $('.add-parents-center').trigger('click');
                $('input[name="name_parents_center[]"]').eq(index).val(parents_center[index]['name']);
                $('input[name="phone_number_parents_center[]"]').eq(index).val(parents_center[index]['phone']);
                $('input[name="email_parents_center[]"]').eq(index).val(parents_center[index]['email']);
                $('input[name="role_parents_center[]"]').eq(index).val(parents_center[index]['role']);
                $('input[name="facebook_parents_center[]"]').eq(index).val(parents_center[index]['facebook']);
                $('input[name="instagram_parents_center[]"]').eq(index).val(parents_center[index]['instagram']);
                $('input[name="linkedin_parents_center[]"]').eq(index).val(parents_center[index]['linkedin']);
                contador_parents_center++;
            }
        }

        if (students_center.length > 0) {
            let contador_students_center = 1;
            for (let index = 0; index < students_center.length; index++) {
                contador_students_center > 1 && $('.add-students-center').trigger('click');
                $('input[name="name_students_center[]"]').eq(index).val(students_center[index]['name']);
                $('input[name="phone_number_students_center[]"]').eq(index).val(students_center[index]['phone']);
                $('input[name="email_students_center[]"]').eq(index).val(students_center[index]['email']);
                $('input[name="role_students_center[]"]').eq(index).val(students_center[index]['role']);
                $('input[name="facebook_students_center[]"]').eq(index).val(students_center[index]['facebook']);
                $('input[name="instagram_students_center[]"]').eq(index).val(students_center[index]['instagram']);
                $('input[name="linkedin_students_center[]"]').eq(index).val(students_center[index]['linkedin']);
                contador_students_center++;
            }
        }

        $('#modal-crud').modal('show');
        $('#btnUpdate').attr('data-id', data._id).removeClass('d-none');
        $('#btnSave').addClass('d-none');
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
                const name = $('#name').val();
                const address = $('#address').val();
                const contactName = $('#contact_name').val();
                const level = $('#level').val();
                const students = $('#students').val();
                const disabilityStudents = $('#disability_students').val();
                const presidentContactName = $('#president_contact_name').val();
                const presidentContactPhone = $('#president_contact_phone').val();
                const secretaryContactName = $('#secretary_contact_name').val();
                const createdData = await controller.saveItem({
                    name,
                    address,
                    contactName,
                    level,
                    students,
                    disabilityStudents,
                    presidentContactName,
                    presidentContactPhone,
                    secretaryContactName
                });
                Swal.fire({
                    icon: 'success',
                    text: `Registro creado éxito`
                });

                $('#modal-crud').modal('hide');
                $('.parents-center-appened').remove();
                $('.students-center-appened').remove();
                datatable.ajax.reload(null, false);
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                html: 'Error creando usuario, contacte a CODESUD.'
            });
        }
    });

    $('#btnUpdate').click(async function (e) {
        e.preventDefault();
        try {
            if ($('#crud-form').parsley(parselyOptions).validate()) {
                const _id = $('#btnUpdate').attr('data-id');
                const name = $('#name').val();
                const phone_number_institution = $('#phone_number_institution').val();
                const email_institution = $('#email_institution').val();
                const address = $('#address').val();
                const contact_name = $('#contact_name').val();
                const supporter = $('#supporter').val();
                const dependence = $('#dependence').val();
                const level = $('#level').val();
                const students = $('#students').val();
                const disability_students = $('#disability_students').val();
                const maps_link = $('#maps_link').val();
                const web_site = $('#web_site').val();
                let parents_center = [];
                let name_parents_center = $("input[name='name_parents_center[]']").map(function () {
                    return $(this).val();
                }).get();
                let phone_number_parents_center = $("input[name='phone_number_parents_center[]']").map(function () {
                    return $(this).val();
                }).get();
                let email_parents_center = $("input[name='email_parents_center[]']").map(function () {
                    return $(this).val();
                }).get();
                let role_parents_center = $("input[name='role_parents_center[]']").map(function () {
                    return $(this).val();
                }).get();
                let facebook_parents_center = $("input[name='facebook_parents_center[]']").map(function () {
                    return $(this).val();
                }).get();
                let instagram_parents_center = $("input[name='instagram_parents_center[]']").map(function () {
                    return $(this).val();
                }).get();
                let linkedin_parents_center = $("input[name='linkedin_parents_center[]']").map(function () {
                    return $(this).val();
                }).get();

                for (let i = 0; i < name_parents_center.length; i++) {
                    parents_center = [
                        ...parents_center,
                        {
                            name: name_parents_center[i],
                            phone: phone_number_parents_center[i],
                            email: email_parents_center[i],
                            role: role_parents_center[i],
                            facebook: facebook_parents_center[i],
                            instagram: instagram_parents_center[i],
                            linkedin: linkedin_parents_center[i]
                        }
                    ];
                }

                let students_center = [];
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
                let linkedin_students_center = $("input[name='linkedin_students_center[]']").map(function () {
                    return $(this).val();
                }).get();

                for (let i = 0; i < name_students_center.length; i++) {
                    students_center = [
                        ...students_center,
                        {
                            name: name_students_center[i],
                            phone: phone_number_students_center[i],
                            email: email_students_center[i],
                            role: role_students_center[i],
                            facebook: facebook_students_center[i],
                            instagram: instagram_students_center[i],
                            linkedin: linkedin_students_center[i]
                        }
                    ];
                }

                const resp = await controller.updateItem({
                    _id,
                    name,
                    phone_number_institution,
                    email_institution,
                    address,
                    contact_name,
                    supporter,
                    dependence,
                    level,
                    students,
                    disability_students,
                    parents_center,
                    students_center,
                    maps_link,
                    web_site
                });

                if (resp === true) {
                    Swal.fire({
                        icon: 'success',
                        title: "Datos Actualizados",
                        text: "Registro actualizado con éxito.",
                        showCancelButton: false,
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "OK"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.reload();
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        html: 'Error actualizando institución, contacte a SOPOERTE TÉCNICO.'
                    });
                }
            }
        } catch (e) {
            Swal.fire({
                icon: 'error',
                html: 'Error actualizando institución, contacte a SOPORTE TÉCNICO.'
            });
        }
    });

    $('#btnDelete').click(async function (e) {
        if (datatable.rows({ selected: true }).data().toArray().length > 0) {
            const userData = datatable.rows({ selected: true }).data().toArray()[0];
            let { isConfirmed } = await controller.confirmDeleteUser(userData);
            if (isConfirmed) {
                await controller.deleteUser({ id: userData.id });
                Swal.fire({ icon: 'success', text: 'Usuario borrado con éxito!' });
                datatable.ajax.reload(null, false);
            }
        }
    });

    $('#modal-crud').on('hidden.bs.modal', function (event) {
        $('#crud-form').parsley().reset();
        $('#crud-form').find('input').val('');
        $('#btnUpdate').addClass('d-none');
        $('#btnSave').removeClass('d-none');
        $('.parents-center-appened').remove();
        $('.students-center-appened').remove();
    });
});

function appendParentCenter() {
    let maxField = 5;
    let addButton = $('.add-parents-center');
    let wrapper = $('.field_wrapper_paternt_center');

    let x = 1;
    $(addButton).click(function () {
        if (x < maxField) {
            x++;
            $(wrapper).append(` 
                <div class="row parents-center-appened">
                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                        <div class="form-group">
                            <label for="name_parents_center">NOMBRE</label>
                            <input type="text" name="name_parents_center[]" class="form-control"
                                placeholder="Ingrese Nombre" required>
                        </div>
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                        <div class="form-group">
                            <label for="phone_number_parents_center">TELÉFONO</label>
                            <input type="number" name="phone_number_parents_center[]" class="form-control"
                                placeholder="Ingrese Teléfono" required>
                        </div>
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                        <div class="form-group">
                            <label for="email_parents_center">EMAIL</label>
                            <input type="email" name="email_parents_center[]"
                                class="form-control" placeholder="Ingrese Email">
                        </div>
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                        <div class="form-group">
                            <label for="role_parents_center">ROL</label>
                            <input type="text" name="role_parents_center[]" class="form-control"
                                placeholder="Ingrese Rol" required>
                        </div>
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <div class="form-group">
                            <label for="facebook_parents_center">FACEBOOK</label>
                            <input type="text" name="facebook_parents_center[]" class="form-control"
                                placeholder="Ingrese Facebook" required>
                        </div>
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <div class="form-group">
                            <label for="instagram_parents_center">INSTAGRAM</label>
                            <input type="text" name="instagram_parents_center[]" class="form-control"
                                placeholder="Ingrese Instagram" required>
                        </div>
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <div class="form-group">
                            <label for="linkedin_parents_center">LINKEDIN</label>
                            <input type="text" name="linkedin_parents_center[]" class="form-control"
                                placeholder="Ingrese Linkedin">
                        </div>
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <button 
                            type="button"
                            class="btn btn-danger drop-parents-center"
                            style="float: right;"
                        > Borrar </button>
                    </div>
                </div>  
            `);
        }
    });

    $(wrapper).on('click', '.drop-parents-center', function (e) {
        e.preventDefault();
        $(this).parents('.parents-center-appened').remove();
        x--;
    });
}

function appendStudentsCenter() {
    let maxField = 5;
    let addButton = $('.add-students-center');
    let wrapper = $('.field_wrapper_students_center');

    //Agrega un campo. 
    let x = 1;
    $(addButton).click(function () {
        if (x < maxField) {
            x++;
            $(wrapper).append(` 
                <div class="row students-center-appened">
                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                        <div class="form-group">
                            <label for="name_students_center">NOMBRE</label>
                            <input type="text" name="name_students_center[]" class="form-control"
                                placeholder="Ingrese Nombre" required>
                        </div>
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                        <div class="form-group">
                            <label for="phone_number_students_center">TELÉFONO</label>
                            <input type="number" name="phone_number_students_center[]" class="form-control"
                                placeholder="Ingrese Teléfono" required>
                        </div>
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                        <div class="form-group">
                            <label for="email_students_center">EMAIL</label>
                            <input type="email" name="email_students_center[]"
                                class="form-control" placeholder="Ingrese Email">
                        </div>
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3">
                        <div class="form-group">
                            <label for="role_students_center">ROL</label>
                            <input type="text" name="role_students_center[]" class="form-control"
                                placeholder="Ingrese Rol" required>
                        </div>
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <div class="form-group">
                            <label for="facebook_students_center">FACEBOOK</label>
                            <input type="text" name="facebook_students_center[]" class="form-control"
                                placeholder="Ingrese Facebook" required>
                        </div>
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <div class="form-group">
                            <label for="instagram_students_center">INSTAGRAM</label>
                            <input type="text" name="instagram_students_center[]" class="form-control"
                                placeholder="Ingrese Instagram" required>
                        </div>
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <div class="form-group">
                            <label for="linkedin_students_center">LINKEDIN</label>
                            <input type="text" name="linkedin_students_center[]" class="form-control"
                                placeholder="Ingrese Linkedin">
                        </div>
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <button 
                            type="button"
                            class="btn btn-danger drop-students-center"
                            style="float: right;"
                        > Borrar </button>
                    </div>
                </div>  
            `);
        }
    });

    $(wrapper).on('click', '.drop-students-center', function (e) {
        e.preventDefault();
        $(this).parents('.students-center-appened').remove();
        x--;
    });
}

function getInstitutions() {
    const institutionId = globalCredentials.institution;
    $.ajax({
        type: 'GET',
        url: '/api/institution/' + institutionId,
        dataType: 'json',
        beforeSend: function () {
            Swal.fire({
                title: 'Obteniendo datos ...',
                allowEscapeKey: false,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                }
            });
        },
        success: function (response) {
            $('#institutionsList').html('');

            for (let i = 0; i < response.length; i++) {
                let html = `
                    <div class="accordion mb-2" id="accordion-${i}">
                        <div class="card z-depth-0 bordered">
                            <div class="card-header" id="heading-${i}" data-toggle="collapse" data-target="#collapse-${i}" aria-expanded="true" aria-controls="collapse-${i}" style="background: #fba900; color: #fff;">
                                <h5 class="mb-0"> <i class="fas fa-chevron-right"></i> ${response[i]['name']} </h5>
                            </div>
                            
                            <div id="collapse-${i}" class="collapse" aria-labelledby="heading-${i}" data-parents="#accordion-${i}">
                                <div class="card-body p-4" style="font-size: 15px;">
                                    <div class="row mb-4">
                                        <div class="col-12">
                                            <button type="button" data-id="${response[i]['_id']}" class="btn bg-pink-400 border-left-1 btnDelete" style="float: right;">
                                                BORRAR <i class="fad fa-trash fa-lg fa-fw"></i>
                                            </button>
                                            <button type="button" data-id="${response[i]['_id']}" class="btn btn-warning border-left-1 btnEdit" style="float: right;">
                                                EDITAR <i class="fad fa-edit fa-lg fa-fw"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                                            <label class="font-weight-bold text-muted"> <i class="fas fa-angle-double-right"></i> DIRECTOR(A)  </label>
                                            <p> ${response[i]['contact_name']} </p>
                                        </div>

                                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                                            <label class="font-weight-bold text-muted"> <i class="fas fa-angle-double-right"></i> TELÉFONO  </label>
                                            <p> ${response[i]['phone_number_institution']} </p>
                                        </div>

                                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                                            <label class="font-weight-bold text-muted"> <i class="fas fa-angle-double-right"></i> EMAIL  </label>
                                            <p> ${response[i]['email_institution']} </p>
                                        </div>

                                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                                            <label class="font-weight-bold text-muted"> <i class="fas fa-angle-double-right"></i> SOSTENEDOR  </label>
                                            <p> ${response[i]['supporter']} </p>
                                        </div>

                                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                                            <label class="font-weight-bold text-muted"> <i class="fas fa-angle-double-right"></i> DEPENDENCIA  </label>
                                            <p> ${response[i]['dependence']} </p>
                                        </div>

                                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                                            <label class="font-weight-bold text-muted"> <i class="fas fa-angle-double-right"></i> NIVEL  </label>
                                            <p>`;

                const level = response[i]['level'];
                for (let n = 0; n < level.length; n++) {
                    html += `${level[n]}; `;
                }

                html += `                   </p>
                                        </div>

                                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                                            <label class="font-weight-bold text-muted"> <i class="fas fa-angle-double-right"></i> N° ALUMNOS  </label>
                                            <p> ${response[i]['students']} </p>
                                        </div>

                                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                                            <label class="font-weight-bold text-muted"> <i class="fas fa-angle-double-right"></i> N° ALUMNOS CON DISCAPACIDAD  </label>
                                            <p> ${response[i]['disability_students']} </p>
                                        </div>
                                        
                                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                                            <label class="font-weight-bold text-muted"> <i class="fas fa-angle-double-right"></i> REGIÓN  </label>
                                            <p> ${response[i]['region']} </p>
                                        </div>

                                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                                            <label class="font-weight-bold text-muted"> <i class="fas fa-angle-double-right"></i> PROVINCIA  </label>
                                            <p> ${response[i]['province']} </p>
                                        </div>

                                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                                            <label class="font-weight-bold text-muted"> <i class="fas fa-angle-double-right"></i> COMUNA  </label>
                                            <p> ${response[i]['commune']} </p>
                                        </div>
                                        
                                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                                            <label class="font-weight-bold text-muted"> <i class="fas fa-angle-double-right"></i> DIRECCIÓN  </label>
                                            <p> ${response[i]['address']} </p>
                                        </div>
                                        
                                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                                            <label class="font-weight-bold text-muted"> <i class="fas fa-angle-double-right"></i> SITIO WEB  </label>
                                            <p> <a href="${response[i]['web_site']}">${response[i]['web_site']}</a> </p>
                                        </div>

                                        <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                                            <label class="font-weight-bold text-muted"> <i class="fas fa-angle-double-right"></i> MAPA  </label>
                                            <p> <a href="${response[i]['maps_link']}">${response[i]['maps_link']}</a> </p>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="accordion mb-2" id="accordion-${i}-parents-center-${i}" style="width:100%;">
                                            <div class="card z-depth-0 bordered">
                                                <div class="card-header" id="heading-${i}-parents-center-${i}" data-toggle="collapse" data-target="#collapse-${i}-parents-center-${i}" aria-expanded="true" aria-controls="collapse-${i}-parents-center-${i}" style="background: #fba900; color: #fff;">
                                                    <h5 class="mb-0"> <i class="fas fa-chevron-right"></i> CENTRO DE PADRES </h5>
                                                </div>
                            
                                                <div id="collapse-${i}-parents-center-${i}" class="collapse" aria-labelledby="heading-${i}-parents-center-${i}" data-parents="#accordion-${i}-parents-center-${i}">
                                                    <div class="card-body p-4" style="font-size: 15px;">`;

                const parents_center = response[i].parents_center;
                if (parents_center.length > 0) {
                    for (let p = 0; p < parents_center.length; p++) {
                        html += `   
                            <div class="row mb-4">
                                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-2">
                                    <label class="font-weight-bold text-muted"> <i class="fas fa-angle-double-right"></i> NOMBRE  </label>
                                    <p> ${parents_center[p]['name']} </p>
                                </div>

                                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-2">
                                    <label class="font-weight-bold text-muted"> <i class="fas fa-angle-double-right"></i> ROL  </label>
                                    <p> ${parents_center[p]['role']} </p>
                                </div>

                                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-2">
                                    <label class="font-weight-bold text-muted"> <i class="fas fa-angle-double-right"></i> TELÉFONO  </label>
                                    <p> ${parents_center[p]['phone']} </p>
                                </div>

                                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-2">
                                    <label class="font-weight-bold text-muted"> <i class="fas fa-angle-double-right"></i> EMAIL  </label>
                                    <p> ${parents_center[p]['email']} </p>
                                </div>
                                
                                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                                    <div class="text-center" style="font-size: 60px;"><i class="fab fa-facebook-square"></i></div>
                                    <p class="text-center"> ${parents_center[p]['facebook'] ? parents_center[p]['facebook'] : 'Sin información'} </p>
                                </div>
                                
                                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                                    <div class="text-center" style="font-size: 60px;"><i class="fab fa-instagram-square"></i></div>
                                    <p class="text-center"> ${parents_center[p]['instagram'] ? parents_center[p]['instagram'] : 'Sin información'} </p>
                                </div>
                                
                                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                                    <div class="text-center" style="font-size: 60px;"><i class="fab fa-linkedin"></i></div>
                                    <p class="text-center"> ${parents_center[p]['linkedin'] ? parents_center[p]['linkedin'] : 'Sin información'} </p>
                                </div>
                            </div> `;
                    }
                } else {
                    html += `
                            <div class="row">
                                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-2">
                                    Sin información
                                </div>
                            </div>`;
                }

                html += `                           </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row">
                                        <div class="accordion mb-2" id="accordion-${i}-students-center-${i}" style="width:100%;">
                                            <div class="card z-depth-0 bordered">
                                                <div class="card-header" id="heading-${i}-students-center-${i}" data-toggle="collapse" data-target="#collapse-${i}-students-center-${i}" aria-expanded="true" aria-controls="collapse-${i}-students-center-${i}" style="background: #fba900; color: #fff;">
                                                    <h5 class="mb-0"> <i class="fas fa-chevron-right"></i> CENTRO DE ALUMNOS </h5>
                                                </div>

                                                <div id="collapse-${i}-students-center-${i}" class="collapse" aria-labelledby="heading-${i}-students-center-${i}" data-parents="#accordion-${i}-students-center-${i}">
                                                    <div class="card-body p-4" style="font-size: 15px;">`;

                const students_center = response[i].students_center;
                if (students_center.length > 0) {
                    for (let p = 0; p < students_center.length; p++) {
                        html += `   
                            <div class="row mb-4">
                                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-2">
                                    <label class="font-weight-bold text-muted"> <i class="fas fa-angle-double-right"></i> NOMBRE  </label>
                                    <p> ${students_center[p]['name']} </p>
                                </div>

                                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-2">
                                    <label class="font-weight-bold text-muted"> <i class="fas fa-angle-double-right"></i> ROL  </label>
                                    <p> ${students_center[p]['role']} </p>
                                </div>

                                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-2">
                                    <label class="font-weight-bold text-muted"> <i class="fas fa-angle-double-right"></i> TELÉFONO  </label>
                                    <p> ${students_center[p]['phone']} </p>
                                </div>

                                <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 mb-2">
                                    <label class="font-weight-bold text-muted"> <i class="fas fa-angle-double-right"></i> EMAIL  </label>
                                    <p> ${students_center[p]['email']} </p>
                                </div>
                                
                                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                                    <div class="text-center" style="font-size: 60px;"><i class="fab fa-facebook-square"></i></div>
                                    <p class="text-center"> ${students_center[p]['facebook'] ? students_center[p]['facebook'] : 'Sin información'} </p>
                                </div>
                                
                                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                                    <div class="text-center" style="font-size: 60px;"><i class="fab fa-instagram-square"></i></div>
                                    <p class="text-center"> ${students_center[p]['instagram'] ? students_center[p]['instagram'] : 'Sin información'} </p>
                                </div>
                                
                                <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                                    <div class="text-center" style="font-size: 60px;"><i class="fab fa-linkedin"></i></div>
                                    <p class="text-center"> ${students_center[p]['linkedin'] ? students_center[p]['linkedin'] : 'Sin información'} </p>
                                </div>
                            </div> `;
                    }
                } else {
                    html += `
                        <div class="row">
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-2">
                                Sin información
                            </div>
                        </div> `;
                }

                html += `                           </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> `;

                $('#institutionsList').append(html);

                $(`#btnEdit-${i}`).attr('data-id', response[i]._id);
            }

            Swal.close();
        }
    });
}

appendParentCenter();
appendStudentsCenter();
getInstitutions();