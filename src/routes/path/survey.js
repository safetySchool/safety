const questions = require('../../config/questions.json');
const jwt = require('../../helpers/jwt');
const SurveyGraduates = require('../../models/surveyGraduates');
const Surveys = require('../../models/surveys');
const Graduates = require('../../models/graduates');

module.exports = [{
    method: 'GET',
    path: '/survey',
    options: {
        handler: async function (request, h) {
            return h.view('app/survey');
        }
    }
}, {
    method: 'GET',
    path: '/survey/preview',
    options: {
        handler: async function (request, h) {
            return h.view('app/surveyPreview', { questions }, { layout: 'clean' });
        }
    }
}, {
    method: 'GET',
    path: '/survey/public/{token}',
    options: {
        auth: false,
        handler: async function (request, h) {
            const { token } = request.params;
            const { survey, graduate, surveyGraduate } = await jwt.verify(token);
            const surveyData = await Surveys.findById(survey).exec();
            const surveyGraduateData = await SurveyGraduates.findById(surveyGraduate).exec();
            if (surveyGraduateData.answered) {
                return h.view('app/surveyAnswered', {}, { layout: 'clean' });
            }
            if (surveyData.closed){
                return h.view('app/surveyClosed', {}, { layout: 'clean' });
            }
            const graduateData = await Graduates.findById(graduate).exec();
            const graduateName = `${graduateData.name} ${graduateData.lastname}`.toUpperCase();
            return h.view('app/surveyPublic', {
                graduateName,
                questions,
                graduate: graduateData._id,
                surveyGraduate
            }, { layout: 'clean' });
        }
    }
}, {
    method: 'GET',
    path: '/survey/response/{token}',
    options: {
        handler: async function (request, h) {
            const { token } = request.params;
            const { surveyGraduate } = await jwt.verify(token);
            const surveyGraduateData = await SurveyGraduates.findById(surveyGraduate).exec();
            for (const [i, question] of questions[0].questions.entries()) {
                const response = surveyGraduateData.responses.find(q=>q.id === question.id);
                questions[0].questions[i].response = response ? response.value : 'Sin respuesta';
            }
            return h.view('app/surveyResponse', { questions, surveyGraduate }, { layout: 'clean' });
        }
    }
}, {
    method: 'GET',
    path: '/survey/ok',
    options: {
        auth: false,
        handler: async function (request, h) {
            return h.view('app/surveyOk', {}, { layout: 'clean' });
        }
    }
}];
