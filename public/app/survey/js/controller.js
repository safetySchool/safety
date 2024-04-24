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
            const email = graduate.email;
            const surveyGraduate = await this.savesurveyGraduates({ survey: survey._id, graduate: graduate._id });
            const { token } = await global.generateToken({ graduate:graduate._id, survey:survey._id, surveyGraduate: surveyGraduate._id });
            controller.mailSurveyGraduates({ graduateName: graduate.name, email, token });
        }
    },
    confirmCloseSurvey(){
        return Swal.fire({
            title: '¿Seguro cerrar encuesta?',
            html: 'Los egresados ya no podrán ingresar nuevas respuestas después de esta acción',
            icon: 'info',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Confirmar!',
            confirmButtonAriaLabel: 'Confirmar',
            cancelButtonText: 'Cancelar',
            cancelButtonAriaLabel: 'Thumbs down'
        });
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
    mailSurveyGraduates({ graduateName, token, email }){
        return $.ajax({
            type: 'POST',
            url: '/api/surveyGraduates/mail',
            data: { graduateName, token, email },
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
    closeSurvey({ id }) {
        return $.ajax({
            type: 'DELETE',
            url: '/api/surveys',
            data: { id },
            dataType: 'json'
        });
    }
};
