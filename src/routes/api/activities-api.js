const Joi = require('@hapi/joi');

const activityController = require('../../controllers/activities');

module.exports = [{
    method: 'GET',
    path: '/api/activities/datatables',
    options: {
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0)
            })
        },
        handler: activityController.list
    }
}, {
    method: 'GET',
    path: '/api/activities/datatables/{institution}',
    options: {
        validate: {
            params: Joi.object().keys({
                _: Joi.number().min(0),
                institution: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    console.log(`ERROR: ${err} - ${request}`);
                }
            }
        },
        handler: activityController.listByInstitutionId
    }
}, {
    method: 'GET',
    path: '/api/activities/{_id}',
    options: {
        validate: {
            params: Joi.object().keys({
                _id: Joi.string().required()
            }),
            failAction: async (request, h, error) => {
                return error;
            }
        },
        handler: activityController.getById
    }
}, {
    method: 'GET',
    path: '/api/activities/getDocumentValidation/{activity}',
    options: {
        validate: {
            query: Joi.object().keys({
                activity: Joi.string().optional()
            }),
            failAction: async (request, h, error) => {
                if (error) {
                    throw error;
                }
            }
        },
        handler: activityController.getDocumentValidation
    }
}, {
    method: 'GET',
    path: '/api/activities/getLastMovementDate/{activity}',
    options: {
        validate: {
            query: Joi.object().keys({
                activity: Joi.string().optional()
            }),
            failAction: async (request, h, error) => {
                if (error) {
                    throw error;
                }
            }
        },
        handler: activityController.getLastMovementDate
    }
}, {
    method: 'POST',
    path: '/api/activities',
    options: {
        validate: {
            payload: Joi.object().keys({
                name: Joi.string().required(),
                description: Joi.string().required(),
                institution: Joi.string().optional()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    console.log(`ERROR: ${err}`);
                }
            }
        },
        handler: activityController.create
    }
}, {
    method: 'PATCH',
    path: '/api/activities',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                _id: Joi.string().required(),
                name: Joi.string().required(),
                institution: Joi.string().optional(),
                description: Joi.string().required(),
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: activityController.update
    }
}, {
    method: 'DELETE',
    path: '/api/activities',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                _id: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: activityController.delete
    }
}, {
    method: 'POST',
    path: '/api/activities/multipart',
    handler: activityController.uploadDocument,
    options: {
        validate: {
            payload: Joi.object().keys({
                files: Joi.required(),
                people: Joi.string().required(),
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
}, {
    method: 'GET',
    path: '/api/activities/getActivities',
    options: {
        validate: {
            query: Joi.object().keys({
                _id: Joi.string().required()
            }),
            failAction: async (request, h, error) => {
                if (error) {
                    throw error;
                }
            }
        },
        handler: activityController.getFilesByActivityId
    }
}, {
    method: 'PATCH',
    path: '/api/activities/updateDate',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                people: Joi.string().required(),
                date: Joi.string().required(),
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: activityController.updateDate
    }
}, {
    method: 'PATCH',
    path: '/api/activities/validated',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                _id: Joi.string().required(),
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: activityController.validated
    }
}];
