const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));

const User = require('../../models/users');
const Role = require('../../models/roles');

module.exports = [{
    method: 'POST',
    path: '/api/login/search_user',
    options: {
        auth: false,
        handler: async (request, h) => {
            let {login} = request.payload;
            try {
                return await User.find({
                    login,
                    active: true
                }).populate('role').populate('role.permissions', ['module', 'type']).exec();
            } catch (error) {
                console.log(error);
                return [];
            }
        },
        validate: {
            payload: Joi.object().keys({
                login: Joi.string().required()
            })
        }
    }
}];
