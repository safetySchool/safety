const Joi = require('@hapi/joi');

const InstitutionController = require('../../controllers/institutions');

module.exports = [{
    method: 'GET',
    path: '/api/institution',
    options: {
        auth: false,
        handler: InstitutionController.list
    }
}, {
    method: 'GET',
    path: '/api/institution/datatables',
    options: {
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0)
            })
        },
        handler: InstitutionController.list
    }
}, {
    method: 'GET',
    path: '/api/institution/{id}',
    options: {
        validate: {
            params: Joi.object().keys({
                id: Joi.string().required()
            })
        },
        handler: InstitutionController.get
    }
}, {
    method: 'GET',
    path: '/api/institution/user/{id}',
    options: {
        validate: {
            params: Joi.object().keys({
                id: Joi.string().required()
            })
        },
        handler: InstitutionController.getByUserId
    }
}, {
    method: 'POST',
    path: '/api/institution',
    options: {
        auth: false,
        validate: {
            payload: Joi.object().keys({
                name: Joi.string().required(),
                phone_number_institution: Joi.string().required(),
                email_institution: Joi.string().required(),
                maps_link: Joi.string().required(),
                address: Joi.string().required(),
                contact_name: Joi.string().required(),
                level: Joi.array().optional(),
                students: Joi.number().required(),
                disability_students: Joi.number().required(),
                president_contact_name: Joi.string().required(),
                president_contact_phone: Joi.number().required(),
                secretary_contact_name: Joi.string().required(),
                active: Joi.boolean().required()
            }),
            failAction: async (request, h, err) => {
                console.log(err);
                if (err) {
                    throw err;
                }
            }
        },
        handler: InstitutionController.create
    }
}, {
    method: 'PATCH',
    path: '/api/institution',
    options: {
        validate: {
            payload: Joi.object().keys({
                _id: Joi.string().required(),
                name: Joi.string().required(),
                phone_number_institution: Joi.string().required(),
                email_institution: Joi.string().required(),
                address: Joi.string().required(),
                contact_name: Joi.string().required(),
                supporter: Joi.string().optional(),
                dependence: Joi.string().required(),
                level: Joi.array().optional(),
                students: Joi.number().required(),
                disability_students: Joi.number().required(),
                parents_center: Joi.array().optional(),
                students_center: Joi.array().optional(),
                maps_link: Joi.string().required(),
                web_site: Joi.string().optional()
            }),
            failAction: async (request, h, err) => {
                console.log(err);
                if (err) {
                    throw err;
                }
            }
        },
        handler: InstitutionController.update
    }
}, {
    method: 'PATCH',
    path: '/api/user/{user_id}/institution/{institution_id}',
    options: {
        validate: {
            params: Joi.object().keys({
                user_id: Joi.string().required(),
                institution_id: Joi.string().required()
            })
        },
        handler: InstitutionController.remove_institution_from_user
    }
}];
