var Permission = require('../models/permissions');

exports.list = async (request, h) => {
    try {
        const permission = await Permission.find({}).exec();
        return permission;
    } catch (error) {
        process.env.NODE_ENV === 'dev' ? console.log(error) : null;
        return [];
    }
};

exports.get = async (request, h) => {
    try {
        const permission = await Permission.findById(request.params.id).exec();
        if (!permission) { return { message: 'Registro no encontrado' }; }
        return permission;
    } catch (error) {
        process.env.NODE_ENV === 'dev' ? console.log(error) : null;
        return [];
    }
};

exports.create = async (request, h) => {
    try {
        const permissionData = {
            module: request.payload.module,
            action: request.payload.action,
            description: request.payload.description,
            active: request.payload.active
        };
        const permission = await Permission.create(permissionData);
        return { message: 'Registro creado con exito', permission };
    } catch (error) {
        process.env.NODE_ENV === 'dev' ? console.log(error) : null;
        return [];
    }
};

exports.update = async (request, h) => {
    try {
        const permission = await Permission.findById(request.payload._id).exec();
        if (!permission) { return { err: 'Registro no encontrado' }; }
        permission.module = request.payload.module || permission.module;
        permission.action = request.payload.action || permission.action;
        permission.description = request.payload.description || permission.description;
        permission.active = 'active' in request.payload ? request.payload.active : permission.active;
        await permission.save();
        return { message: 'Registro actualizado con exito!' };
    } catch (error) {
        process.env.NODE_ENV === 'dev' ? console.log(error) : null;
        return [];
    }
};

exports.remove = async (request, h) => {
    try {
        const permission = await Permission.findById(request.params.id).exec();
        if (!permission) { return { err: 'Registro no encontrado' }; }

        permission.active = request.payload.active;

        await Permission.save(permission);
        return { message: 'Registro desactivado con exito!' };
    } catch (error) {
        process.env.NODE_ENV === 'dev' ? console.log(error) : null;
        return [];
    }
};