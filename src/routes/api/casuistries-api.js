const Joi = require('@hapi/joi');

const CasuistryController = require('../../controllers/casuistries');

module.exports = [{
    method: 'GET',
    path: '/api/casuistries/getCasuistries',
    options: {
        handler: CasuistryController.list
    }
}];
