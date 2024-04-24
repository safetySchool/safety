const Movement = require('../models/accident_movement');
const Boom = require('@hapi/boom');
const moment = require('moment');
const shell = require('shelljs');
const Path = require('path');
const fs = require('fs');

const generateHash = require('../helpers/generatePassword');

function writeFile(filepath, stream) {
    return new Promise(function (resolve, reject) {
        const newFile = fs.createWriteStream(filepath);
        newFile.on('error', reject);
        stream.pipe(newFile);

        const ret = {filepath, headers: stream.hapi.headers};
        stream.on('end', resolve(ret));
    });
}

exports.get = async (request, h) => {
    try {
        const institution = request.auth.credentials.institution;
        const movement = await Movement.find({
            accident: request.params.id,
            institution: institution,
            active: true
        }).populate('typeDocument', {name: 1}).exec();
        if (!movement) {
            return {message: 'Registro no encontrado'};
        }
        return movement;
    } catch (error) {
        process.env.NODE_ENV === 'dev' ? console.log(error) : null;
        return [];
    }
};

exports.getLastMovementDate = async (request, h) => {
    try {
        const institution = request.params.institution;
        const accidentId = request.params.referenceId;
        const lastMovement = await Movement.find({
            institution: institution,
            accident: accidentId,
            active: true
        }).exec();
        let lastMovementDate = '';
        let lastMovementId = '';
        if (lastMovement.length === 0) {
            lastMovement.date = 'No hay movimientos back';
            return lastMovement;
        } else {
            for (let i = 0; i < lastMovement.length; i++) {
                if (i === 0) {
                    lastMovementDate = moment(lastMovement[i].date, 'DD/MM/YYYY').format('YYYY-MM-DD');
                    lastMovementId = lastMovement[i]._id;
                }
                const movement = moment(lastMovement[i].date, 'DD/MM/YYYY').format('YYYY-MM-DD');
                if (moment(movement).isAfter(lastMovementDate)) {
                    lastMovementDate = lastMovement[i].date;
                    lastMovementId = lastMovement[i]._id;
                }
            }
            return await Movement.findOne({
                _id: lastMovementId
            }).exec();
        }
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.getActivitiesMovementValidation = async (request, h) => {
    try {
        const institution = request.params.institution;
        const accidentId = request.params.referenceId;
        const lastValidation = await Movement.find({
            institution: institution,
            accident: accidentId,
            active: true
        }).exec();
        if (lastValidation.length === 0) {
            lastValidation.validated = 'Sin ActivitiesMovementos';
            return lastValidation;
        } else {
            let validationFalse = '';
            let validationTrue = '';
            for (let i = 0; i < lastValidation.length; i++) {
                if (lastValidation[i].validated === false) {
                    validationFalse = lastValidation[i];
                } else if (lastValidation[i].validated === true) {
                    validationTrue = lastValidation[i];
                }
            }
            if (validationFalse === '') {
                return validationTrue;
            } else {
                return validationFalse;
            }
        }
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.getFilesByActivitiesMovementId = async (request, h) => {
    try {
        const document = await Movement.findById(request.query._id).exec();
        if (!document) {
            return {message: 'Registro no encontrado'};
        }
        return document.files;
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.getById = async (request, h) => {
    try {
        const document = await Movement.findById(request.params._id).exec();
        if (!document) {
            return {message: 'Registro no encontrado'};
        }
        return document;
    } catch (error) {
        process.env.NODE_ENV === 'dev' ? console.log(error) : null;
        return [];
    }
};

exports.getFilesById = async (request, h) => {
    try {
        const document = [await Movement.findById(request.params._id).exec()];
        if (!document) {
            return {message: 'Registro no encontrado'};
        }
        let arrayFiles = [];
        for (let i = 0; i < document[0].files.length; i++) {
            arrayFiles.push({path: document[0].files[i], name: document[0].files[i].substring(document[0].files[i].lastIndexOf('/') + 1)});
        }
        document.files = arrayFiles;
        return arrayFiles;
    } catch (error) {
        process.env.NODE_ENV === 'dev' ? console.log(error) : null;
        return [];
    }
};


exports.create = async (request, h) => {
    try {
        const documentData = {
            accident: request.payload.referenceId,
            typeDocument: request.payload.typeDocument,
            date: request.payload.date,
            reference: request.payload.reference,
            institution: request.payload.institution
        };
        const document = await Movement.create(documentData);
        return document._id;
    } catch (error) {
        console.log(error);
        Boom.badImplementation('Internal Error');
    }
};

exports.update = async (request, h) => {
    try {
        const document = await Movement.findById(request.payload._id).exec();
        if (!document) {
            return {err: 'Registro no encontrado'};
        }
        document.typeDocument = request.payload.typeDocument || document.typeDocument;
        document.date = request.payload.date || document.date;
        document.reference = request.payload.reference || document.reference;
        document.validated = 'validated' in request.payload ? request.payload.validated : document.validated;
        await document.save();
        return {message: 'Registro actualizado con exito!'};
    } catch (error) {
        process.env.NODE_ENV === 'dev' ? console.log(error) : null;
        return [];
    }
};

exports.updateDate = async (request, h) => {
    try {
        const document = await Movement.findById(request.payload.people).exec();
        if (!document) {
            return {err: 'Registro no encontrado'};
        }
        document.date = request.payload.date || document.date;
        await document.save();
        return {message: 'Registro actualizado con exito!'};
    } catch (error) {
        process.env.NODE_ENV === 'dev' ? console.log(error) : null;
        return [];
    }
};

exports.delete = async (request, h) => {
    try {
        const document = await Movement.findById(request.payload._id).exec();
        if (!document) {
            return {err: 'Registro no encontrado'};
        }
        document.active = false;
        await document.save();
        return {message: 'Registro actualizado con exito!'};
    } catch (error) {
        console.log(error);
        process.env.NODE_ENV === 'dev' ? console.log(error) : null;
        return [];
    }
};

exports.upload = async (request, h) => {
    try {
        const _id = request.payload._id;
        const document = await Movement.findById(_id).exec();
        const data = request.payload;
        const name = data.file.hapi.filename;
        const relativePath = `${__dirname}/../../public/uploads/documents/${_id}/`;
        const path = relativePath + name;
        const savePath = path.substring(path.indexOf('/public'));
        if (!fs.existsSync(relativePath)) {
            fs.mkdirSync(relativePath);
        }
        const file = fs.createWriteStream(path);
        data.file.pipe(file);
        document.files.push(savePath);
        await document.save();
        return {message: 'Archivo subido con exito!'};
    } catch (error) {
        console.log(error);
        Boom.badImplementation('Internal Error');
    }
};

exports.uploadActivitiesMovement = async (request, h) => {
    try {
        let datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        let {files, _id} = request.payload;
        let rowsDb = [];
        if (files) {
            files = Array.isArray(files) ? files : [files];
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                let {password: hash} = generateHash();
                let name = file.hapi.filename;
                let fileType = file.hapi.headers['content-type'];
                name = name.replace(/ /g, '_');
                name = name.replace(/-/g, '_');
                name = name.replace(/[.](?=.*[.])/g, '_');
                name = `${name.split('.')[0] || 'DOCUMENTO'}_${hash}.${name.split('.')[1] || ''}`;

                let relativePath = `public/uploads/documents/${_id}`;

                let path = Path.resolve(__dirname, '../../', relativePath);

                relativePath = `/${relativePath}/${name}`;

                const filepath = `${path}/${name}`;
                !fs.existsSync(path) && shell.mkdir('-p', path);
                await writeFile(filepath, file);

                //SAVE IN DB
                const movementDocument = await Movement.findById(_id).exec();
                movementDocument.files.push({filepath: relativePath, name, fileType, date: datetime});
                await movementDocument.save();
            }
            return {error: false, rowsDb};
        }
        return {message: 'ok'};
    } catch (error) {
        console.log(error);
        return {error: true, message: 'Error subiendo los archivos'};
    }
};
