const Joi = require('@hapi/joi');

const checkpointController = require('../../controllers/checkpoints');

module.exports = [{
    method: 'GET',
    path: '/api/checkpoints/datatables/{subcategory}',
    options: {
        validate: {
            params: Joi.object().keys({
                _: Joi.number().min(0),
                subcategory: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: checkpointController.list
    }
}];
