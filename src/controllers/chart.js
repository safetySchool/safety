const Boom = require('@hapi/boom');
const Checkpoint = require('../models/checkpoints');
const Document = require('../models/documents');

exports.getPercentageByCategoryOrSubcategory = async (request, h) => {
    try {
        const { category_or_subcategoty } = request.params;

        let checkpoints = await Checkpoint.find({ category: category_or_subcategoty, active: true }).lean();

        if (checkpoints.length === 0) {
            checkpoints = await Checkpoint.find({ subcategory: category_or_subcategoty, active: true }).lean();
        }

        let totalCheckpoints = 0;
        let validatedCheckpoints = 0;

        await Promise.all(checkpoints.map(async (checkpoint) => {
            const documents = await Document.find({ checkpoint: checkpoint._id, active: true }).lean();

            if (documents.length === 0) {
                totalCheckpoints += 1;
                return;
            }

            const validatedDocuments = documents.filter(document => document.validated);

            if (validatedDocuments.length === documents.length) {
                validatedCheckpoints += 1;
            }

            totalCheckpoints += 1;
        }));

        const percentage = totalCheckpoints === 0 ? 0 : Math.round((validatedCheckpoints / totalCheckpoints) * 100);
        const pending = 100 - percentage;
        let data = [percentage, pending];

        return data;
    } catch (error) {
        console.log(error);
        throw Boom.badImplementation('Internal Error');
    }
};

