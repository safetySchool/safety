const Joi = require('@hapi/joi');

const help_documentsController = require('../../controllers/help_documents');

module.exports = [{
    method: 'GET',
    path: '/api/helpDocuments/getDocumentsByCheckPointId',
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
        handler: help_documentsController.getFilesByDocumentId
    }
},
{
    method: 'PATCH',
    path: '/api/helpDocuments/updateDate',
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
        handler: help_documentsController.updateDate
    }
},
{
    method: 'POST',
    path: '/api/helpDocuments/multipart',
    handler: help_documentsController.uploadDocument,
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
}];
