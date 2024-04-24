const Joi = require('@hapi/joi');

const CourseController = require('../../controllers/courses');
const UserController = require('../../controllers/users');

module.exports = [{
    method: 'GET',
    path: '/api/courses',
    options: {
        handler: CourseController.list
    }
}, {
    method: 'GET',
    path: '/api/courses/datatables',
    options: {
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0)
            })
        },
        handler: CourseController.list
    }
}, {
    method: 'GET',
    path: '/api/courses/{id}',
    options: {
        validate: {
            params: Joi.object().keys({
                id: Joi.string().required()
            })
        },
        handler: CourseController.get
    }
}, {
    method: 'POST',
    path: '/api/courses',
    options: {
        validate: {
            payload: Joi.object().keys({
                name: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: CourseController.create
    }
}, {
    method: 'PATCH',
    path: '/api/courses',
    options: {
        validate: {
            payload: Joi.object().keys({
                id: Joi.string().required(),
                name: Joi.string().optional(),
                active: Joi.string().optional()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: CourseController.update
    }
},{
    method: 'DELETE',
    path: '/api/courses',
    options: {
        validate: {
            payload: Joi.object().keys({
                id: Joi.string().required()
            }),
            failAction: async (request, h, err) => {
                if (err) {
                    throw err;
                }
            }
        },
        handler: CourseController.remove
    }
}];
