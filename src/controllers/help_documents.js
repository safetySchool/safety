var Help_documents = require('../models/help_documents');
var TypesDocuments = require('../models/typesDocuments');
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

        const ret = { filepath, headers: stream.hapi.headers };
        stream.on('end', resolve(ret));
    });
}

exports.getFilesByDocumentId = async (request, h) => {
    try {
        const { _id } = request.query;
        const document = await Help_documents.findOne({ checkpoint: _id });
        if (!document) {
            return { message: 'Registro no encontrado' };
        }
        return document.files;
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.updateDate = async (request, h) => {
    try {
        const { people, date } = request.payload;
        let help_document = await Help_documents.findOne({ checkpoints: people });
        if (!help_document) { return { err: 'Registro no encontrado' }; }
        help_document.date = date || help_document.date;
        await help_document.save();
        return { message: 'Registro actualizado con exito!' };
    } catch (error) {
        process.env.NODE_ENV === 'dev' ? console.log(error) : null;
        return [];
    }
};

exports.uploadDocument = async (request, h) => {
    try {
        const document_type_id = await TypesDocuments.findOne({ name: 'Documento' }).select('_id');
        console.log({ document_type_id });
        let datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        let { files, people } = request.payload;
        let rowsDb = [];
        if (files) {
            files = Array.isArray(files) ? files : [files];
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                let { password: hash } = generateHash();
                let name = file.hapi.filename;
                let fileType = file.hapi.headers['content-type'];
                name = name.replace(/ /g, '_');
                name = name.replace(/-/g, '_');
                name = name.replace(/[.](?=.*[.])/g, '_');
                name = `${name.split('.')[0] || 'DOCUMENTO'}_${hash}.${name.split('.')[1] || ''}`;

                let relativePath = `public/uploads/documents/${people}`;
                let path = Path.resolve(__dirname, '../../', relativePath);

                relativePath = `/${relativePath}/${name}`;

                const filepath = `${path}/${name}`;
                !fs.existsSync(path) && shell.mkdir('-p', path);
                await writeFile(filepath, file);

                let peopleObj = await Help_documents.findOne({ checkpoints: people });
                if (!peopleObj) {
                    peopleObj = new Help_documents({ checkpoint: people, typeDocument: document_type_id, files: [{ filepath: relativePath, name, fileType, date: datetime }] });
                } else {
                    peopleObj.files.push({ filepath: relativePath, name, fileType, date: datetime });
                }
                await peopleObj.save();
            }
            return { error: false, rowsDb };
        }
        return { message: 'ok' };
    } catch (error) {
        console.log(error);
        return { error: true, message: 'Error subiendo los archivos' };
    }
};