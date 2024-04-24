const Joi = require('@hapi/joi');
const chart = require('../../controllers/chart');

module.exports = [{
    method: 'GET',
    path: '/chart/getPercentageByCategoryOrSubcategory/{category_or_subcategoty}',
    options: {
        validate: {
            params: Joi.object().keys({
                category_or_subcategoty: Joi.string().required()
            })
        },
        handler: chart.getPercentageByCategoryOrSubcategory
    }
}
];
