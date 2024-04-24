const SurveyGraduates = require('../models/surveyGraduates');
const Boom = require('@hapi/boom');
const { sendMailCustom } = require('../helpers/sendMail');
const config = require('../config/index');

exports.list = async (request, h) => {
    try {
        return await SurveyGraduates.find().exec();
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};
exports.listGraduates = async (request, h) => {
    try {
        const { survey } = request.params;
        return await SurveyGraduates.find({ survey }).populate({ path: 'graduate', populate: { path: 'course' } }).exec();
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.get = async (request, h) => {
    try {
        const surveyGraduate = await SurveyGraduates.findById(request.params.id).exec();
        if (!surveyGraduate) {
            return { message: 'Registro no encontrado' };
        }
        return surveyGraduate;
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.create = async (request, h) => {
    try {
        let { survey, graduate } = request.payload;
        return await SurveyGraduates.create({ survey, graduate });
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.sendMail = async (request, h) => {
    try {
        let { email, graduateName, token } = request.payload;
        await sendMailCustom(email, 'Encuesta Liceo Bicentenario', {
            name: graduateName,
            actionUrl: `${config.publicUrl}/survey/public/${token}`
        }, 'newSurvey', null);
        return { error: false };
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.update = async (request, h) => {
    try {
        const surveyGraduate = await SurveyGraduates.findById(request.payload.id).exec();
        if (!surveyGraduate) {
            return { err: true, message: 'Registro no encontrado' };
        }

        surveyGraduate.responses = request.payload.responses || surveyGraduate.responses;
        surveyGraduate.responseDate = request.payload.responseDate || surveyGraduate.responseDate;
        surveyGraduate.answered = 'answered' in request.payload ? request.payload.answered : surveyGraduate.answered;

        await surveyGraduate.save();
        return { err: false, message: 'Registro actualizado con exito!' };
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};
exports.close = async (request, h) => {
    try {
        const surveyGraduate = await SurveyGraduates.findById(request.payload.id).exec();
        if (!surveyGraduate) {
            return { err: 'Registro no encontrado' };
        }

        surveyGraduate.closed = true;

        await surveyGraduate.save();
        return { message: 'Registro desactivado con exito!' };
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};
