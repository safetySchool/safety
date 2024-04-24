var Commune = require('../models/communes');

exports.list = async (request, h) => {
    try {
        const commune = await Commune.find({ active: true }).lean();
        return commune;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.find = async (request, h) => {
    let region = request.region ? request.region : request.query.region;
    try {
        const commune = await Commune.find({ region }).lean();
        return commune;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.get = async (request, h) => {
    try {
        const commune = await Commune.findById(request.params.id).exec();
        if (!commune) { return { message: 'Registro no encontrado' }; }
        return commune;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.create = async (request, h) => {
    try {
        const communeData = {
            name: request.payload.name,
            region: request.payload.region
        };
        const commune = await Commune.create(communeData);
        return { message: 'Registro creado con exito', commune };
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.update = async (request, h) => {
    try {
        const commune = await Commune.findById(request.payload.id).exec();
        if (!commune) { return { err: 'Registro no encontrado' }; }

        commune.name = request.payload.name || commune.name;
        commune.region = request.payload.region || commune.region;
        commune.active = 'active' in request.payload ? request.payload.active : commune.active;

        await commune.save();
        return { message: 'Registro actualizado con exito!' };
    } catch (error) {
        console.log(error);
        return [];
    }
};
exports.remove = async (request, h) => {
    try {
        const commune = await Commune.findById(request.params.id).exec();
        if (!commune) { return { err: 'Registro no encontrado' }; }

        commune.active = request.payload.active;

        await Commune.save(commune);
        return { message: 'Registro desactivado con exito!' };
    } catch (error) {
        console.log(error);
        return [];
    }
};