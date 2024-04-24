const Joi = require('@hapi/joi');


const TypeDocumentController = require('../../controllers/typesDocuments');

module.exports = [{
    method: 'GET',
    path: '/api/typesDocuments',
    options: {
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0).optional()
            })
        },
        handler: TypeDocumentController.list
    }
}];
