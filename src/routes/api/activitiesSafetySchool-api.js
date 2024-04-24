const Joi = require('@hapi/joi');

const activitySafetySchoolController = require('../../controllers/activitiesSafetySchool');

module.exports = [{
    method: 'GET',
    path: '/api/activitiesSafetySchool/datatables',
    options: {
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0)
            })
        },
        handler: activitySafetySchoolController.list
    }
}];