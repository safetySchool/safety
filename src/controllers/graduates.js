const Graduate = require('../models/graduates');
const Boom = require('@hapi/boom');

exports.list = async (request, h) => {
    try {
        return await Graduate.find({ active: true }).populate('course', ['name']).exec();
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.getDistictYears = async (request, h) => {
    try {
        return await Graduate.find().distinct('year').exec();
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};
exports.getByYears = async (request, h) => {
    try {
        const { years } = request.payload;
        return await Graduate.find({ year: { $all: years } }).exec();
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.get = async (request, h) => {
    try {
        const graduate = await Graduate.findById(request.params.id).exec();
        if (!graduate) {
            return { message: 'Usuario no encontrado' };
        }
        return graduate;
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.create = async (request, h) => {
    try {
        let { course, dni, phone, year, name, lastname, email } = request.payload;
        return await Graduate.create({ course, dni, phone, year, name, lastname, email });
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.update = async (request, h) => {
    try {
        const graduate = await Graduate.findById(request.payload.id).exec();
        if (!graduate) {
            return { err: true, message: 'Usuario no encontrado' };
        }

        graduate.course = request.payload.course || graduate.course;
        graduate.dni = request.payload.dni || graduate.dni;
        graduate.phone = request.payload.phone || graduate.phone;
        graduate.year = request.payload.year || graduate.year;
        graduate.name = request.payload.name || graduate.name;
        graduate.lastname = request.payload.lastname || graduate.lastname;
        graduate.email = request.payload.email || graduate.email;
        graduate.active = 'active' in request.payload ? request.payload.active : graduate.active;

        await graduate.save();
        return { err: false, message: 'Registro actualizado con exito!' };
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};
exports.remove = async (request, h) => {
    try {
        const graduate = await Graduate.findById(request.payload.id).exec();
        if (!graduate) {
            return { err: 'Usuario no encontrado' };
        }

        graduate.active = false;

        await graduate.save();
        return { message: 'Usuario desactivado con exito!' };
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};
