const Boom = require('@hapi/boom');
const Casuistry = require('../models/casuistries');

exports.list = async (request, h) => {
    try {
        const casuistry = await Casuistry.find({ active: true }).exec();
        return casuistry;
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};