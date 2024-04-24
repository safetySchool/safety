const Joi = require('@hapi/joi');

const Institution2Controller = require('../../controllers/institutions2');

module.exports = [{
    method: 'GET',
    path: '/api/institution2',
    options: {
        auth: false,
        handler: Institution2Controller.list
    }
}, {
    method: 'GET',
    path: '/api/institution2/datatables',
    options: {
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0)
            })
        },
        handler: Institution2Controller.list
    }
}, {
    method: 'GET',
    path: '/api/institution2/{id}',
    options: {
        validate: {
            params: Joi.object().keys({
                id: Joi.string().required()
            })
        },
        handler: Institution2Controller.get
    }
}, {
    method: 'GET',
    path: '/api/institution2/RegionsProvincesCommunes',
    options: {
        auth: false,
        handler: Institution2Controller.list_regions_provinces_communes
    }
}, {
    method: 'POST',
    path: '/api/institution2',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                name: Joi.string().required(),
                region: Joi.string().optional(),
                province: Joi.string().optional(),
                commune: Joi.string().optional(),
                address: Joi.string().optional(),
                active: Joi.boolean().optional(),
                phone_number_institution: Joi.string().optional(),
                email_institution: Joi.string().optional(),
                maps_link: Joi.string().optional()
            }),
            failAction: async (request, h, err) => {
                console.log("error api: ", err);
                if (err) {
                    throw err;
                }
            }
        },
        handler: Institution2Controller.create
    }
}, {
    method: 'PATCH',
    path: '/api/institution2',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                _id: Joi.string().required(),
                name: Joi.string().required(),
                region: Joi.string().optional(),
                province: Joi.string().optional(),
                commune: Joi.string().optional(),
                address: Joi.string().optional(),
                active: Joi.boolean().required(),
                phone_number_institution: Joi.string().optional(),
                email_institution: Joi.string().optional(),
                maps_link: Joi.string().optional()
            }),
            failAction: async (request, h, err) => {
                console.log(err);
                if (err) {
                    throw err;
                }
            }
        },
        handler: Institution2Controller.update
    }
}];
