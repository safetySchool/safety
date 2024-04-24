const Boom = require('@hapi/boom');

const TypeDocument = require('../models/typesDocuments');

exports.list = async (request, h) => {
    try {
        const typesDocuments = await TypeDocument.find({}).sort({ name: 1 }).exec();
        return typesDocuments;
    } catch (error) {
        console.log(error);
        Boom.badImplementation('Internal Error');
    }
};