$(function () {
    controller.loadInstitutions().then(r => console.log(r));
    $('.select2').select2();
    const parselyOptions = {
        errorClass: 'is-invalid', successClass: 'is-valid', classHandler: function (ParsleyField) {
            return ParsleyField.$element;
        }, errorsWrapper: '<div class="invalid-feedback"></div>', errorTemplate: '<div></div>'
    };

    $('#btnCreate').click(function (e) {
        e.preventDefault();
        $('#crud-form').parsley().reset();
        $('#institution').val([]).change();
        $('#description').val('');
        $('#btnUpdate').hide();
        $('#btnSave').show();
        $('#modal-crud').modal('show');
    });

    // $('#btnSave').click(async function (e) {
    //     e.preventDefault();
    //     try {
    //         if ($('#crud-form').parsley(parselyOptions).validate()) {
    //             const name = $('#name').val().toUpperCase();
    //             const institutions = $('#institution').val();
    //             const description = $('#description').val().toUpperCase();

    //             if (institutions.length > 0) {
    //                 for (const institution of institutions) {
    //                     const data = {
    //                         name: name,
    //                         institution: institution,
    //                         description: description
    //                     };
    //                     await controller.saveActivity(data);
    //                 }
    //                 Swal.fire({
    //                     icon: 'success',
    //                     text: institutions.length === 1 ? 'Actividad creada' : 'Actividades creadas',
    //                 });
    //                 $('#modal-crud').modal('hide');
    //                 $('#institution').val([]).change();
    //                 datatable.ajax.reload(null, false);
    //             }
    //         }
    //     } catch (e) {
    //         Swal.fire({
    //             icon: 'error',
    //             html: `Error creando actividad, contacte a CODESUD.${e}`
    //         });
    //     }
    // });

    // $('#btnUpdate').click(async function (e) {
    //     e.preventDefault();
    //     try {
    //         if ($('#crud-form').parsley(parselyOptions).validate()) {
    //             const _id = $('#btnUpdate').attr('data-id');
    //             const name = $('#name').val().toUpperCase();
    //             const institution = $('#institution').val();
    //             const description = $('#description').val().toUpperCase();
    //             const data = {
    //                 _id: _id,
    //                 name: name,
    //                 institution: institution,
    //                 description: description
    //             };
    //             await controller.updateActivity(data);
    //             Swal.fire({
    //                 icon: 'success',
    //                 text: 'Actividad actualizada con éxito!'
    //             });
    //             $('#modal-crud').modal('hide');
    //             $('#institution').val([]).change();
    //             datatable.ajax.reload(null, false);
    //         }
    //     } catch (e) {
    //         Swal.fire({
    //             icon: 'error',
    //             html: 'Error actualizando actividad, contacte a CODESUD.'
    //         });
    //     }
    // });

});

function btnEditClick(_id) {
    controller.getActivityById(_id).then(r => {
        $('#name').val(r.name);
        $('#institution').val(r.institution).change();
        $('#description').val(r.description);
        $('#btnUpdate').attr('data-id', _id);
        $('#btnUpdate').show();
        $('#btnSave').hide();
        $('#modal-crud').modal('show');
    });
}

function btnDeleteClick(_id) {
    Swal.fire({
        title: '¿Está seguro de borrar la actividad?',
        text: 'Esta acción no se puede revertir',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, borrar!'
    }).then((result) => {
        if (result.value) {
            const data = {
                _id: _id
            };
            controller.deleteActivity(data);
            Swal.fire(
                'Borrado!',
                'El documento ha sido borrado.',
                'success'
            ).then((result) => {
                    if (result.value) {
                        datatable.ajax.reload(null, false);
                    }
                }
            );
        }
    });
    $('#modal-datatable-documents').show();
}

$('#filterInstitution').change(function () {
    // mandar al datatable el valor de filterInstitution
    const filterInstitutionId = $('#filterInstitution').val();
    if (filterInstitutionId === '') {
        datatable.ajax.url('/api/activities/datatables').load();
    } else {
        datatable.ajax.url(`/api/activities/datatables/${filterInstitutionId}`).load();
    }
});

$('#modal-crud').on('hidden.bs.modal', function () {
    $('#crud-form').parsley().reset();
    $('#crud-form').find('input').val('');
    $('#btnUpdate').addClass('d-none');
    $('#btnSave').removeClass('d-none');
    $('#institution').val([]).trigger('change');
});

$('#modal-datatable-documents').on('hidden.bs.modal', function (event) {
    datatable.ajax.reload(null, false);
    datatableDocument.destroy();
});
