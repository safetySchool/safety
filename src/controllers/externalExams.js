const fs = require('fs');
const shell = require('shelljs');
const Path = require('path');
const Moment = require('moment');

var ExternalExam = require('../models/externalExams');
var FileHelper = require('../helpers/writeFile');


exports.list = async (request, h) => {
    try {
        const externalExam = await ExternalExam.find().lean();
        return externalExam;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.find = async (request, h) => {
    let user = request.user ? request.user : request.query.user;
    try {
        return await ExternalExam.find({ user }).lean();
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.get = async (request, h) => {
    try {
        const externalExam = await ExternalExam.findById(request.params.id).exec();
        if (!externalExam) { return { message: 'Registro no encontrado' }; }
        return externalExam;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.create = async (request, h) => {
    try {
        var externalExamData = {
            user: request.payload.user,
            path: request.payload.path
        };
        request.payload.examName && (externalExamData.examName = request.payload.examName);

        const externalExam = await ExternalExam.create(externalExamData);
        return { message: 'Registro creado con exito', externalExam };
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.update = async (request, h) => {
    try {
        const externalExam = await ExternalExam.findById(request.payload.id).exec();
        if (!externalExam) { return { err: 'Registro no encontrado' }; }

        externalExam.path = request.payload.path || externalExam.path;
        externalExam.date = new Date();
        externalExam.active = 'active' in request.payload ? request.payload.active : externalExam.active;

        await externalExam.save();
        return { message: 'Registro actualizado con exito!' };
    } catch (error) {
        console.log(error);
        return [];
    }
};
exports.upload = async (request, h) => {
    try {
        var { userId, file, extension, examName } = request.payload;

        let relativePath = `uploads/externalExams/user_${userId}`;

        let path = Path.resolve(__dirname, '../../', relativePath);
        let fileName = `${Moment().format('YYYY_MM_DD_HH_mm_ss')}.${extension}`;
        let filepath = `${path}/${fileName}`;
        let dbPath = `${relativePath}/${fileName}`;

        !fs.existsSync(path) && shell.mkdir('-p', path);

        await FileHelper.write(filepath, file);

        return { error: false, filepath: dbPath, userId, examName };
    } catch (error) {
        console.log(error);
        return { error: true };
    }
};
exports.remove = async (request, h) => {
    try {
        await ExternalExam.deleteOne({ _id: request.payload.id });
        return { message: 'Registro eliminado con éxito!' };
    } catch (error) {
        console.log(error);
        return [];
    }
};