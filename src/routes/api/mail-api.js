const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const { sendMailCustom } = require('../../helpers/sendMail');
const config = require('../../config');

module.exports = [{
    method: 'POST',
    path: '/api/mail/newpassword',
    options: {
        validate: {
            payload: Joi.object().keys({
                fullname: Joi.string().min(0).required(),
                login: Joi.string().min(0).required(),
                password: Joi.string().min(0).required(),
                email: Joi.string().min(0).required()
            })
        },
        handler: async (request, h)=>{
            let { email, password, login, fullname } = request.payload;
            await sendMailCustom(email, 'Nueva Contraseña', {
                fullname,
                password,
                login,
                actionUrl: `${config.publicUrl}/login`
            }, 'newpassword', null);
            return { error: false };
        }
    }
}];
