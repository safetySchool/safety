var Answer = require('../models/answers');


exports.list = async (request, h) => {
    try {
        const answer = await Answer.find().lean();
        return answer;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.find = async (request, h) => {
    let user = request.user ? request.user : request.query.user;
    try {
        return await Answer.find({ user }).lean();
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.findAdmin = async (request, h) => {
    let id = request.id ? request.id : request.query.id;
    try {
        return await Answer.find({ 'responses.id': id }).lean();
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.get = async (request, h) => {
    try {
        const answer = await Answer.findById(request.params.id).exec();
        if (!answer) { return { message: 'Registro no encontrado' }; }
        return answer;
    } catch (error) {
        console.log(error);
        return [];
    }
};
exports.lastResponse = async (request, h) => {
    try {
        let user = request.query.userId;
        const lastResponse = await Answer.find({ user }).sort({ _id: -1 }).limit(1).lean();
        if (!lastResponse) { return { message: 'Sin respuestas' }; }
        return lastResponse;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.create = async (request, h) => {
    try {
        const answerData = {
            user: request.payload.user,
            type: request.payload.type,
            responses: request.payload.responses
        };
        const answer = await Answer.create(answerData);
        return { message: 'Registro creado con exito', answer };
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.update = async (request, h) => {
    try {
        const answer = await Answer.findById(request.payload.id).exec();
        if (!answer) { return { err: 'Registro no encontrado' }; }

        answer.responses = request.payload.responses || answer.responses;
        answer.completed = request.payload.completed || answer.completed;
        answer.date = new Date();
        answer.active = 'active' in request.payload ? request.payload.active : answer.active;

        await answer.save();
        return { message: 'Registro actualizado con exito!' };
    } catch (error) {
        console.log(error);
        return [];
    }
};
exports.remove = async (request, h) => {
    try {
        const answer = await Answer.findById(request.params.id).exec();
        if (!answer) { return { err: 'Registro no encontrado' }; }

        answer.active = request.payload.active;

        await Answer.save(answer);
        return { message: 'Registro desactivado con exito!' };
    } catch (error) {
        console.log(error);
        return [];
    }
};