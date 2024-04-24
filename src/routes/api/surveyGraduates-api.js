const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);


const SurveyGraduatesController = require('../../controllers/surveyGraduates');

module.exports = [{
    method: 'GET',
    path: '/api/surveyGraduates',
    options: {
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0).optional()
            })
        },
        handler: SurveyGraduatesController.list
    }
}, {
    method: 'GET',
    path: '/api/surveyGraduates/{survey}',
    options: {
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0).optional()
            }),
            params: Joi.object().keys({
                survey: Joi.objectId().required()
            })
        },
        handler: SurveyGraduatesController.listGraduates
    }
}, {
    method: 'POST',
    path: '/api/surveyGraduates',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                survey: Joi.string().required(),
                graduate: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: SurveyGraduatesController.create
    }
},{
    method: 'POST',
    path: '/api/surveyGraduates/mail',
    options: {
        validate: {
            payload: Joi.object().keys({
                email: Joi.string().required(),
                graduateName: Joi.string().required(),
                token: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: SurveyGraduatesController.sendMail
    }
}, {
    method: 'PATCH',
    path: '/api/surveyGraduates',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                id: Joi.string().required(),
                responses: Joi.array().optional(),
                responseDate: Joi.string().optional(),
                answered: Joi.boolean().optional()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: SurveyGraduatesController.update
    }
}, {
    method: 'DELETE',
    path: '/api/surveyGraduates',
    options: {
        validate: {
            payload: Joi.object().keys({
                id: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: SurveyGraduatesController.close
    }
}];
