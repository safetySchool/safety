// eslint-disable-next-line no-unused-vars
let controller = {
    async loadCourses() {
        const courses = await this.getCourses();
        $('#role').empty();
        for (const course of courses) {
            $('#course').append(`<option value="${course._id}">${course.name}</option>`);
        }
    },
    test(){
    },
    loadYears() {
        let year = parseInt(dayjs().format('YYYY'));
        let yearsInit = 2019;
        while (year >= yearsInit){
            $('#year').append(`<option value="${year}">${year}</option>`);
            year--;
        }
    },
    confirmDeleteGraduate(graduateData) {
        return Swal.fire({
            title: `¿Seguro de eliminar al egresado ${graduateData.fullname}?`,
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
    getCourses() {
        return $.ajax({
            type: 'GET',
            url: '/api/courses',
            dataType: 'json'
        });
    },
    getGraduateData(id) {
        return $.ajax({
            type: 'GET',
            url: `/api/graduates/${id}`,
            dataType: 'json'
        });
    },
    saveGraduate({ dni, year, phone, name, lastname, course, email }) {
        return $.ajax({
            type: 'POST',
            url: '/api/graduates',
            data: { dni, year, phone, name, lastname, course, email },
            dataType: 'json'
        });
    },
    updateGraduate({ id, dni, year, phone, name, lastname, course, email }) {
        return $.ajax({
            type: 'PATCH',
            url: '/api/graduates',
            data: { id, dni, year, phone, name, lastname, course, email },
            dataType: 'json'
        });
    },
    deleteGraduate({ id }){
        return $.ajax({
            type: 'DELETE',
            url: '/api/graduates',
            data: { id },
            dataType: 'json'
        });
    }
};
