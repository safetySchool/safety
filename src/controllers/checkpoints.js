const Boom = require('@hapi/boom');

const Checkpoint = require('../models/checkpoints');

exports.list = async (request, h) => {
    try {
        const subcategory = await Checkpoint.find({ subcategory: request.params.subcategory }).sort({ position: 1 }).lean();
        const category = await Checkpoint.find({ category: request.params.subcategory }).sort({ position: 1 }).lean();
        if (subcategory.length > 0) {
            return subcategory;
        } else if (category.length > 0) {
            return category;
        }
    } catch (error) {
        console.log(error);
        Boom.badImplementation('Internal Error');
    }
};
