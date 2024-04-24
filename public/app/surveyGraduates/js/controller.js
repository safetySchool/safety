// eslint-disable-next-line no-unused-vars
let controller = {
    async loadYears() {
        const years = await this.getDistinctYears();
        for (const year of years) {
            $('#years').append(`<option value="${year}">${year}</option>`);
        }
    },
    async handleSaveSurvey({ years }) {
        const survey = await this.saveSurvey({ years });
        const graduates = await this.getGraduatesByDate(years);
        for (const graduate of graduates) {
            await this.savesurveyGraduates({ survey: survey._id, graduate: graduate._id });
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
    async openResponse(surveyGraduate){
        const { token } = await global.generateToken({ surveyGraduate });
        window.open(`/survey/response/${token}`, '_blank');
    },
    async openSurveyGraduates(surveyGraduate, graduate, survey){
        const { token } = await global.generateToken({ surveyGraduate, graduate, survey });
        window.open(`/survey/public/${token}`, '_blank');

    },
    getDistinctYears() {
        return $.ajax({
            type: 'GET',
            url: '/api/graduates/years/distinct',
            dataType: 'json'
        });
    },
    getGraduatesByDate(years) {
        return $.ajax({
            type: 'POST',
            url: '/api/graduates/years',
            data: JSON.stringify({ years }),
            headers: { 'Content-Type': 'application/json' },
            dataType: 'json'
        });
    },
    saveSurvey({ years }) {
        return $.ajax({
            type: 'POST',
            url: '/api/surveys',
            data: JSON.stringify({ years }),
            headers: { 'Content-Type': 'application/json' },
            dataType: 'json'
        });
    },
    savesurveyGraduates({ survey, graduate }) {
        return $.ajax({
            type: 'POST',
            url: '/api/surveyGraduates',
            data: { survey, graduate },
            dataType: 'json'
        });
    },
    updateGraduate({ id, dni, year, phone, name, lastname, course, email }) {
        return $.ajax({
            type: 'PATCH',
            url: '/api/surveys',
            data: { id, dni, year, phone, name, lastname, course, email },
            dataType: 'json'
        });
    },
    deleteGraduate({ id }) {
        return $.ajax({
            type: 'DELETE',
            url: '/api/surveys',
            data: { id },
            dataType: 'json'
        });
    }
};
