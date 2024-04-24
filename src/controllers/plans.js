var Plans = require('../models/plans');

exports.list = async (request, h) => {
    try {
        const plans = await Plans.find({ active: true }).lean();
        return plans;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.find = async (request, h) => {
    try {
        const plans = await Plans.find().lean();
        return plans;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.get = async (request, h) => {
    try {
        const plans = await Plans.findById(request.params.id).exec();
        if (!plans) { return { message: 'Registro no encontrado' }; }
        return plans;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.create = async (request, h) => {
    try {
        const plansData = {
            name: request.payload.name,
            description: request.payload.description,
            pricing: request.payload.pricing,
            duration: request.payload.duration
        };
        const plans = await Plans.create(plansData);
        return { message: 'Registro creado con exito', plans };
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.update = async (request, h) => {
    try {
        const plans = await Plans.findById(request.payload.id).exec();
        if (!plans) { return { err: 'Registro no encontrado' }; }

        plans.name = request.payload.name || plans.name;
        plans.description = request.payload.description || plans.description;
        plans.pricing = request.payload.pricing || plans.pricing,
        plans.duration = request.payload.duration || plans.duration,
        plans.active = 'active' in request.payload ? request.payload.active : plans.active;

        await plans.save();
        return { message: 'Registro actualizado con exito!' };
    } catch (error) {
        console.log(error);
        return [];
    }
};
exports.remove = async (request, h) => {
    try {
        const plans = await Plans.findById(request.params.id).exec();
        if (!plans) { return { err: 'Registro no encontrado' }; }

        plans.active = request.payload.active;

        await plans.save(plans);
        return { message: 'Registro desactivado con exito!' };
    } catch (error) {
        console.log(error);
        return [];
    }
};