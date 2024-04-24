// eslint-disable-next-line no-unused-vars
let controller = {
    async handleSaveAnswers({ surveyGraduate, surveyResponses }) {
        try {
            await this.saveAnswers(surveyGraduate, surveyResponses);
            location.href = '/survey/ok';
        } catch (error) {
            console.log(error);
        }
    },
    saveAnswers(surveyGraduate, surveyResponses) {
        return $.ajax({
            type: 'PATCH',
            url: '/api/surveyGraduates',
            data: JSON.stringify({ id: surveyGraduate, responses: surveyResponses, answered: true, responseDate: new Date() }),
            dataType: 'json',
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
