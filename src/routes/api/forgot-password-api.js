const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const User = require('../../models/users');

module.exports = [{
    method: 'POST',
    path: '/api/forgotPassword/search_user',
    options: {
        auth: false,
        handler: async (request, h) => {
            let { email } = request.payload;
            try {
                const user = await User.find({ email: email, active: true }).exec();
                return user;
            } catch (error) {
                console.log("error forgot-api:", error);
                return [];
            }
        },
        validate: {
            payload: Joi.object().keys({
                email: Joi.string().required()
            })
        }
    }
}];
