const fs = require('fs');
const shell = require('shelljs');
const Path = require('path');
const Moment = require('moment');

var Selfie = require('../models/selfies');
var FileHelper = require('../helpers/writeFile');


exports.list = async (request, h) => {
    try {
        const selfie = await Selfie.find().lean();
        return selfie;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.find = async (request, h) => {
    try {
        let user = request.user ? request.user : request.query.user;
        let filter = { user };
        request.query.type && request.query.type !== '' && (filter.type = request.query.type);
        return await Selfie.find(filter).lean();
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.get = async (request, h) => {
    try {
        const selfie = await Selfie.findById(request.params.id).exec();
        if (!selfie) { return { message: 'Registro no encontrado' }; }
        return selfie;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.create = async (request, h) => {
    try {
        var selfieData = {
            user: request.payload.user,
            path: request.payload.path
        };
        request.payload.type && (selfieData.type = request.payload.type);

        const selfie = await Selfie.create(selfieData);

        return { message: 'Registro creado con exito', selfie };
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.update = async (request, h) => {
    try {
        const selfie = await Selfie.findById(request.payload.id).exec();
        if (!selfie) { return { err: 'Registro no encontrado' }; }

        selfie.path = request.payload.path || selfie.path;
        selfie.date = new Date();
        selfie.active = 'active' in request.payload ? request.payload.active : selfie.active;

        await selfie.save();
        return { message: 'Registro actualizado con exito!' };
    } catch (error) {
        console.log(error);
        return [];
    }
};
exports.upload = async (request, h) => {
    try {
        var { userId, file, extension, type } = request.payload;

        let relativePath = `uploads/selfies/user_${userId}`;

        let path = Path.resolve(__dirname, '../../', relativePath);
        let fileName = `${Moment().format('YYYY_MM_DD_HH_mm_ss')}.${extension}`;
        let filepath = `${path}/${fileName}`;
        let dbPath = `${relativePath}/${fileName}`;

        !fs.existsSync(path) && shell.mkdir('-p', path);

        await FileHelper.write(filepath, file);

        return { error: false, filepath: dbPath, userId, type };
    } catch (error) {
        console.log(error);
        return { error: true };
    }
};
exports.remove = async (request, h) => {
    try {
        const selfie = await Selfie.findById(request.params.id).exec();
        if (!selfie) { return { err: 'Registro no encontrado' }; }

        selfie.active = request.payload.active;

        await Selfie.save(selfie);
        return { message: 'Registro desactivado con exito!' };
    } catch (error) {
        console.log(error);
        return [];
    }
};