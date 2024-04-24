const Boom = require('@hapi/boom');

const Course = require('../models/courses');

exports.list = async (request, h) => {
    try {
        return await Course.find({ active: true }).exec();
    } catch (error) {
        console.log(error);
        Boom.badImplementation('Internal Error');
    }
};

exports.get = async (request, h) => {
    try {
        const course = await Course.findById(request.params.id).exec();
        if (!course) { return { message: 'Registro no encontrado' }; }
        return course;
    } catch (error) {
        console.log(error);
        Boom.badImplementation('Internal Error');
    }
};

exports.create = async (request, h) => {
    try {
        const courseData = {
            name: request.payload.name
        };
        const course = await Course.create(courseData);
        return { message: 'Registro creado con exito', course };
    } catch (error) {
        console.log(error);
        Boom.badImplementation('Internal Error');
    }
};

exports.update = async (request, h) => {
    try {
        const course = await Course.findById(request.payload.id).exec();
        if (!course) { return { err: 'Registro no encontrado' }; }

        course.name = request.payload.name || course.name;
        course.active = 'active' in request.payload ? request.payload.active : course.active;

        await course.save();
        return { message: 'Registro actualizado con exito!' };
    } catch (error) {
        console.log(error);
        Boom.badImplementation('Internal Error');
    }
};
exports.remove = async (request, h) => {
    try {
        const course = await Course.findById(request.payload.id).exec();
        if (!course) { return { err: 'Registro no encontrado' }; }
        course.active = false;

        await course.save(course);
        return { message: 'Registro desactivado con exito!' };
    } catch (error) {
        console.log(error);
        Boom.badImplementation('Internal Error');
    }
};
