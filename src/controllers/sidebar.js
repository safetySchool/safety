const Boom = require('@hapi/boom');
const Category = require('../models/categories');
const SubCategory = require('../models/subCategories');
const Checkpoint = require('../models/checkpoints');
const Document = require('../models/documents');

exports.percentage_compliance_categories = async (request, h) => {
    try {
        let categories = await Category.find().lean();
        let categoriesWithPercentage = [];

        await Promise.all(categories.map(async (category) => {
            const checkpoints = await Checkpoint.find({ category: category._id, active: true }).lean();

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
            categoriesWithPercentage.push({ ...category, percentage: `${percentage}%` });
        }));

        return categoriesWithPercentage;
    } catch (error) {
        console.log(error);
        throw Boom.badImplementation('Internal Error');
    }
};

exports.percentage_compliance_subcategories = async (request, h) => {
    try {
        let subcategories = await SubCategory.find().lean();
        let subcategoriesWithPercentage = [];

        await Promise.all(subcategories.map(async (subcategory) => {
            const checkpoints = await Checkpoint.find({ subcategory: subcategory._id, active: true }).lean();

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
            subcategoriesWithPercentage.push({ ...subcategory, percentage: `${percentage}%` });
        }));

        return subcategoriesWithPercentage;
    } catch (error) {
        console.log(error);
        throw Boom.badImplementation('Internal Error');
    }
};