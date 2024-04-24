const Joi = require('@hapi/joi');

const documentController = require('../../controllers/documents');

module.exports = [{
    method: 'GET',
    path: '/api/documents/datatables/{id}',
    options: {
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0)
            })
        },
        handler: documentController.get
    }
}, {
    method: 'GET',
    path: '/api/documents/{_id}',
    options: {
        validate: {
            params: Joi.object().keys({
                _id: Joi.string().required()
            }),
            failAction: async (request, h, error) => {
                return error;
            }
        },
        handler: documentController.getById
    }
},
{
    method: 'GET',
    path: '/api/documents/files/{_id}',
    options: {
        validate: {
            params: Joi.object().keys({
                _id: Joi.string().required()
            }),
            failAction: async (request, h, error) => {
                return error;
            }
        },
        handler: documentController.getFilesById
    }
},
{
    method: 'GET',
    path: '/api/documents/getDocuments',
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
        handler: documentController.getFilesByDocumentId
    }
},
{
    method: 'GET',
    path: '/api/documents/getLastMovementDate/{institution}/{checkpoint}',
    options: {
        validate: {
            query: Joi.object().keys({
                institution: Joi.string().optional(),
                checkpoint: Joi.string().optional()
            }),
            failAction: async (request, h, error) => {
                console.log(error);
                if (error) {
                    throw error;
                }
            }
        },
        handler: documentController.getLastMovementDate
    }
},
{
    method: 'GET',
    path: '/api/documents/getDocumentValidation/{institution}/{checkpoint}',
    options: {
        validate: {
            query: Joi.object().keys({
                institution: Joi.string().optional(),
                checkpoint: Joi.string().optional()
            }),
            failAction: async (request, h, error) => {
                console.log(error);
                if (error) {
                    throw error;
                }
            }
        },
        handler: documentController.getDocumentValidation
    }
},
{
    method: 'POST',
    path: '/api/documents',
    options: {
        validate: {
            payload: Joi.object().keys({
                checkpoint: Joi.string().required(),
                typeDocument: Joi.string().required(),
                date: Joi.string().required(),
                reference: Joi.string().required(),
                institution: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: documentController.create
    }
}, {
    method: 'POST',
    path: '/api/documents/upload',
    config: {
        payload: {
            allow: "multipart/form-data",
            multipart: { output: "stream" },
        },
    },
    handler: documentController.upload
}, {
    method: 'PATCH',
    path: '/api/documents',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                _id: Joi.string().required(),
                checkpoint: Joi.string().optional(),
                typeDocument: Joi.string().required(),
                date: Joi.string().required(),
                reference: Joi.string().required(),
                active: Joi.boolean().optional(),
                institution: Joi.string().optional(),
                validated: Joi.boolean().optional(),
                files: Joi.optional(),
            }),
            failAction: async (request, h, err) => {
                console.log("error api: ", err);
                if (err) {
                    throw err;
                }
            }
        },
        handler: documentController.update
    }
},
{
    method: 'PATCH',
    path: '/api/documents/updateDate',
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
        handler: documentController.updateDate
    }
},
{
    method: 'DELETE',
    path: '/api/documents',
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
        handler: documentController.delete
    }
},
{
    method: 'DELETE',
    path: '/api/documents/files',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                file_path: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                console.log(err);
                if (err) {
                    throw err;
                }
            }
        },
        handler: documentController.delete_file_by_file_path
    }
},
{
    method: 'POST',
    path: '/api/documents/multipart',
    handler: documentController.uploadDocument,
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
