const Institution = require('../models/institutions');
const User = require('../models/users');

exports.list = async (request, h) => {
    try {
        return await Institution.find({ active: true }).lean();
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.find = async (request, h) => {
    try {
        return await Institution.find({ active: true }).lean();
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.get = async (request, h) => {
    try {
        const _id = request.params.id;
        const institution = [await Institution.findById(_id).exec()];
        if (!institution) { return { message: 'Registro no encontrado' }; }
        return institution;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.getByUserId = async (request, h) => {
    try {
        const user_id = request.params.id;
        const user_data = await User.findById(user_id).exec();
        const institutions = await Institution.find({ _id: user_data.institution }).exec();
        if (!institutions) { return { message: 'Registro no encontrado' }; }
        return institutions;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.create = async (request, h) => {
    try {
        const institutionData = request.payload;
        const institution = await Institution.create(institutionData);
        return { message: 'Registro creado con exito', institution };
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.update = async (request, h) => {
    try {
        const institution = await Institution.findById(request.payload._id).exec();

        if (!institution) { return { err: 'Registro no encontrado' }; }

        institution.name = request.payload.name || institution.name;
        institution.phone_number_institution = request.payload.phone_number_institution || institution.phone_number_institution;
        institution.email_institution = request.payload.email_institution || institution.email_institution;
        institution.address = request.payload.address || institution.address;
        institution.contact_name = request.payload.contact_name || institution.contact_name;
        institution.supporter = request.payload.supporter || institution.supporter;
        institution.dependence = request.payload.dependence || institution.dependence;
        institution.level = request.payload.level || institution.level;
        institution.students = request.payload.students || institution.students;
        institution.disability_students = request.payload.disability_students || institution.disability_students;
        institution.parents_center = request.payload.parents_center || institution.parents_center;
        institution.students_center = request.payload.students_center || institution.students_center;
        institution.maps_link = request.payload.maps_link || institution.maps_link;
        institution.web_site = request.payload.web_site || institution.web_site;

        await institution.save();

        return true;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.remove = async (request, h) => {
    try {
        const institution = await Institution.findById(request.params.id).exec();
        if (!institution) { return { err: 'Registro no encontrado' }; }

        institution.active = request.payload.active;

        await Institution.save(institution);
        return { message: 'Registro desactivado con exito!' };
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.remove_institution_from_user = async (request, h) => {
    try {
        console.log('remove_institution_from_user');
        const user_id = request.params.user_id;
        const institution_id = request.params.institution_id;
        const user = await User.findById(user_id).exec();

        if (!user) { return { err: 'Usuario no encontrado' }; }

        user.institution = user.institution.filter((institution) => institution != institution_id);

        console.log({ user });

        await user.save();
        return { message: 'Registro desactivado con exito!' };
    } catch (error) {
        console.log(error);
        return [];
    }
};
