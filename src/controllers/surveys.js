const Surveys = require('../models/surveys');
const Boom = require('@hapi/boom');

exports.list = async (request, h) => {
    try {
        return await Surveys.aggregate([
            {
                $lookup: {
                    from: 'surveyGraduates',
                    localField: '_id',
                    foreignField: 'survey',
                    as: 'surveyGraduates'
                }
            }
        ]);
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.get = async (request, h) => {
    try {
        const survey = await Surveys.findById(request.params.id).exec();
        if (!survey) {
            return { message: 'Registro no encontrado' };
        }
        return survey;
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.create = async (request, h) => {
    try {
        let { years } = request.payload;
        return await Surveys.create({ years });
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.update = async (request, h) => {
    try {
        const survey = await Surveys.findById(request.payload.id).exec();
        if (!survey) {
            return { err: true, message: 'Registro no encontrado' };
        }

        survey.years = request.payload.years || survey.years;
        survey.lastUpdate = request.payload.lastUpdate || survey.lastUpdate;
        survey.closed = 'closed' in request.payload ? request.payload.closed : survey.closed;

        await survey.save();
        return { err: false, message: 'Registro actualizado con exito!' };
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};
exports.close = async (request, h) => {
    try {
        const survey = await Surveys.findById(request.payload.id).exec();
        if (!survey) {
            return { err: 'Registro no encontrado' };
        }

        survey.closed = true;

        await survey.save();
        return { message: 'Registro desactivado con exito!' };
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};
