const Joi = require('@hapi/joi');

const sidebarController = require('../../controllers/sidebar');

module.exports = [
    {
        method: 'GET',
        path: '/api/percentage_compliance_categories',
        options: {
            handler: sidebarController.percentage_compliance_categories
        }
    },
    {
        method: 'GET',
        path: '/api/percentage_compliance_subcategories',
        options: {
            handler: sidebarController.percentage_compliance_subcategories
        }
    }
];