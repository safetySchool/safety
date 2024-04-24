const Institution2 = require('../models/institutions2');
const RegionsProvincesCommunes = require('../models/regions_provinces_communes');

exports.list = async (request, h) => {
    try {
        return await Institution2.find().lean();
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.find = async (request, h) => {
    try {
        return await Institution2.find({ active: true }).lean();
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.get = async (request, h) => {
    try {
        const institution = await Institution2.findById(request.params.id).exec();
        if (!institution) { return { message: 'Registro no encontrado' }; }
        return institution;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.list_regions_provinces_communes = async (request, h) => {
    try {
        const regions_provinces_communes = await RegionsProvincesCommunes.find().lean();
        return regions_provinces_communes;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.create = async (request, h) => {
    try {
        const institutionData = request.payload;
        console.log('institutionData: ', institutionData);
        const institution = await Institution2.create(institutionData);
        return { message: 'Registro creado con exito', institution };
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.update = async (request, h) => {
    try {
        const institution = await Institution2.findById(request.payload._id).exec();
        if (!institution) { return { err: 'Registro no encontrado' }; }
        institution.name = request.payload.name || institution.name;
        institution.region = request.payload.region || institution.region;
        institution.province = request.payload.province || institution.province;
        institution.commune = request.payload.commune || institution.commune;
        institution.address = request.payload.address || institution.address;
        institution.active = 'active' in request.payload ? request.payload.active : institution.active;
        institution.phone_number_institution = request.payload.phone_number_institution || institution.phone_number_institution;
        institution.email_institution = request.payload.email_institution || institution.email_institution;
        institution.maps_link = request.payload.maps_link || institution.maps_link;
        await institution.save();
        return { message: 'Registro actualizado con exito!' };
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.remove = async (request, h) => {
    try {
        const institution = await Institution2.findById(request.params.id).exec();
        if (!institution) { return { err: 'Registro no encontrado' }; }

        institution.active = request.payload.active;

        await Institution2.save(institution);
        return { message: 'Registro desactivado con exito!' };
    } catch (error) {
        console.log(error);
        return [];
    }
};
