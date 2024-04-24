const Boom = require('@hapi/boom');

const Role = require('../models/roles');

exports.list = async (request, h) => {
    try {
        return await Role.find({}).exec();
    } catch (error) {
        console.log(error);
        Boom.badImplementation('Internal Error');
    }
};

exports.get = async (request, h) => {
    try {
        const role = await Role.findById(request.params.id).exec();
        if (!role) { return { message: 'Registro no encontrado' }; }
        return role;
    } catch (error) {
        console.log(error);
        Boom.badImplementation('Internal Error');
    }
};

exports.create = async (request, h) => {
    try {
        const roleData = {
            name: request.payload.name,
            description: request.payload.description,
            permissions: request.payload.permissions,
            active: request.payload.active
        };
        const role = await Role.create(roleData);
        return { message: 'Registro creado con exito', role };
    } catch (error) {
        console.log(error);
        Boom.badImplementation('Internal Error');
    }
};

exports.update = async (request, h) => {
    try {
        const role = await Role.findById(request.payload._id).exec();
        if (!role) { return { err: 'Registro no encontrado' }; }
        role.name = request.payload.name || role.name;
        role.permissions = request.payload.permissions || role.permissions;
        role.active = 'active' in request.payload ? request.payload.active : role.active;
        role.description = request.payload.description || role.description;
        await role.save();
        return { message: 'Registro actualizado con exito!' };
    } catch (error) {
        console.log(error);
        Boom.badImplementation('Internal Error');
    }
};
exports.remove = async (request, h) => {
    try {
        const role = await Role.findById(request.params.id).exec();
        if (!role) { return { err: 'Registro no encontrado' }; }

        role.active = request.payload.active;

        await Role.save(role);
        return { message: 'Registro desactivado con exito!' };
    } catch (error) {
        console.log(error);
        Boom.badImplementation('Internal Error');
    }
};
