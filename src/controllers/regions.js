var Region = require('../models/regions');

exports.list = async (request, h) => {
    try {
        const region = await Region.find({ active: true }).populate('countries', ['name']).lean();
        return region;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.find = async (request, h) => {
    try {
        const region = await Region.find({ country: request.query.country }).lean();
        return region;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.get = async (request, h) => {
    try {
        const region = await Region.findById(request.params.id).exec();
        if (!region) { return { message: 'Registro no encontrado' }; }
        return region;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.create = async (request, h) => {
    try {
        const regionData = {
            name: request.payload.name,
            country: request.payload.country
        };
        const region = await Region.create(regionData);
        return { message: 'Registro creado con exito', region };
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.update = async (request, h) => {
    try {
        const region = await Region.findById(request.payload.id).exec();
        if (!region) { return { err: 'Registro no encontrado' }; }

        region.name = request.payload.name || region.name;
        region.country = request.payload.country || region.country;
        region.active = 'active' in request.payload ? request.payload.active : region.active;

        await region.save();
        return { message: 'Registro actualizado con exito!' };
    } catch (error) {
        console.log(error);
        return [];
    }
};
exports.remove = async (request, h) => {
    try {
        const region = await Region.findById(request.params.id).exec();
        if (!region) { return { err: 'Registro no encontrado' }; }

        region.active = request.payload.active;

        await region.save(region);
        return { message: 'Registro desactivado con exito!' };
    } catch (error) {
        console.log(error);
        return [];
    }
};