var Country = require('../models/countries');

exports.list = async (request, h) => {
    try {
        return await Country.find({ active: true }).lean();
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.find = async (request, h) => {
    try {
        return await Country.find({ active: true }).lean();
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.get = async (request, h) => {
    try {
        const country = await Country.findById(request.params.id).exec();
        if (!country) { return { message: 'Registro no encontrado' }; }
        return country;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.create = async (request, h) => {
    try {
        const countryData = {
            name: request.payload.name
        };
        const country = await Country.create(countryData);
        return { message: 'Registro creado con exito', country };
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.update = async (request, h) => {
    try {
        const country = await Country.findById(request.payload.id).exec();
        if (!country) { return { err: 'Registro no encontrado' }; }

        country.name = request.payload.name || country.name;
        country.active = 'active' in request.payload ? request.payload.active : country.active;

        await country.save();
        return { message: 'Registro actualizado con exito!' };
    } catch (error) {
        console.log(error);
        return [];
    }
};
exports.remove = async (request, h) => {
    try {
        const country = await Country.findById(request.params.id).exec();
        if (!country) { return { err: 'Registro no encontrado' }; }

        country.active = request.payload.active;

        await Country.save(country);
        return { message: 'Registro desactivado con exito!' };
    } catch (error) {
        console.log(error);
        return [];
    }
};