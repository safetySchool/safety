// eslint-disable-next-line no-unused-vars
let controller = {
    confirmDeleteCourse(graduateData) {
        return Swal.fire({
            title: `¿Seguro de eliminar al carrera ${graduateData.name}?`,
            html: 'Esta acción no se puede revertir',
            icon: 'info',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: '<i class="fa fa-trash"></i> Eliminar!',
            confirmButtonAriaLabel: 'Eliminar',
            cancelButtonText: 'Cancelar',
            cancelButtonAriaLabel: 'Thumbs down'
        });
    },
    getCourseData(id) {
        return $.ajax({
            type: 'GET',
            url: `/api/courses/${id}`,
            dataType: 'json'
        });
    },
    saveCourse({  name }) {
        return $.ajax({
            type: 'POST',
            url: '/api/courses',
            data: { name },
            dataType: 'json'
        });
    },
    updateCourse({ id,  name }) {
        return $.ajax({
            type: 'PATCH',
            url: '/api/courses',
            data: { id,name },
            dataType: 'json'
        });
    },
    deleteCourse({ id }){
        return $.ajax({
            type: 'DELETE',
            url: '/api/courses',
            data: { id },
            dataType: 'json'
        });
    }
};
