const Joi = require('@hapi/joi');

const activitiesSafetySchoolMovement = require('../../controllers/activitiesSafetySchoolMovement');

module.exports = [{
    method: 'GET',
    path: '/api/activitiesSafetySchool_movement/datatables/{id}',
    options: {
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0)
            })
        },
        handler: activitiesSafetySchoolMovement.get
    }
}, {
    method: 'PATCH',
    path: '/api/activitiesSafetySchool_movement',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                _id: Joi.string().required(),
                activitySafetySchool: Joi.string().optional(),
                typeDocument: Joi.string().optional(),
                date: Joi.string().required(),
                reference: Joi.string().required(),
                active: Joi.boolean().optional(),
                validated: Joi.boolean().optional(),
                files: Joi.optional(),
            }),
            failAction: async (request, h, err) => {
                console.log('error api: ', err);
                if (err) {
                    throw err;
                }
            }
        },
        handler: activitiesSafetySchoolMovement.update
    }
}, {
    method: 'GET',
    path: '/api/activitiesSafetySchool_movement/getDocumentValidation/{activitySafetySchool}',
    options: {
        validate: {
            query: Joi.object().keys({
                activitySafetySchool: Joi.string().optional()
            }),
            failAction: async (request, h, error) => {
                console.log(error);
                if (error) {
                    throw error;
                }
            }
        },
        handler: activitiesSafetySchoolMovement.getActivitiesSafetySchoolMovementValidation
    }
}, {
    method: 'GET',
    path: '/api/activitiesSafetySchool_movement/getLastMovementDate/{activitySafetySchool}',
    options: {
        validate: {
            query: Joi.object().keys({
                activitySafetySchool: Joi.string().optional()
            }),
            failAction: async (request, h, error) => {
                console.log(error);
                if (error) {
                    throw error;
                }
            }
        },
        handler: activitiesSafetySchoolMovement.getLastMovementDate
    }
}, {
    method: 'GET',
    path: '/api/activitiesSafetySchool_movement/getDocuments',
    options: {
        validate: {
            query: Joi.object().keys({
                _id: Joi.string().required()
            }),
            failAction: async (request, h, error) => {
                console.log(error);
                if (error) {
                    throw error;
                }
            }
        },
        handler: activitiesSafetySchoolMovement.getFilesByActivitiesMovementId
    }
}, {
    method: 'POST',
    path: '/api/activitiesSafetySchool_movement',
    options: {
        validate: {
            payload: Joi.object().keys({
                referenceId: Joi.string().required(),
                typeDocument: Joi.string().required(),
                date: Joi.string().required(),
                reference: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                console.log('error api: ', err);
                if (err) {
                    throw err;
                }
            }
        },
        handler: activitiesSafetySchoolMovement.create
    }
}, {
    method: 'GET',
    path: '/api/activitiesSafetySchool_movement/{_id}',
    options: {
        validate: {
            params: Joi.object().keys({
                _id: Joi.string().required()
            }),
            failAction: async (request, h, error) => {
                return error;
            }
        },
        handler: activitiesSafetySchoolMovement.getById
    }
}, {
    method: 'DELETE',
    path: '/api/activitiesSafetySchool_movement',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                _id: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                console.log(err);
                if (err) {
                    throw err;
                }
            }
        },
        handler: activitiesSafetySchoolMovement.delete
    }
}, {
    method: 'POST',
    path: '/api/activitiesSafetySchool_movement/multipart',
    handler: activitiesSafetySchoolMovement.uploadActivitiesMovement,
    options: {
        validate: {
            payload: Joi.object().keys({
                files: Joi.required(),
                _id: Joi.string().required(),
            })
        },
        payload: {
            timeout: false,
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data',
            maxBytes: 50000000,
            multipart: true
        }
    }
}];
