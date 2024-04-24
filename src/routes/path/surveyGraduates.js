module.exports = [{
    method: 'GET',
    path: '/survey/graduates/{survey}',
    options: {
        handler: async function (request, h) {
            const { survey } = request.params;
            return h.view('app/surveyGraduates', { survey });
        }
    }
}];
