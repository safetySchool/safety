const Boom = require('@hapi/boom');
const moment = require('moment');
const shell = require('shelljs');
const Path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

const People = require('../models/people');
const PeopleMovement = require('../models/people_movement');
const generateHash = require('../helpers/generatePassword');
const Movement = require('../models/people_movement');

function writeFile(filepath, stream) {
    return new Promise(function (resolve, reject) {
        const newFile = fs.createWriteStream(filepath);
        newFile.on('error', reject);
        stream.pipe(newFile);

        const ret = { filepath, headers: stream.hapi.headers };
        stream.on('end', resolve(ret));
    });
}

exports.list = async (request, h) => {
    try {
        const { type } = request.query;
        return await People.find({ active: true, institution: request.auth.credentials.institution, type }).exec();
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.get = async (request, h) => {
    try {
        const people = await People.findById(request.params.id).exec();
        if (!people) {
            return { message: 'Registro no encontrado' };
        }
        return people;
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};
exports.getDocuments = async (request, h) => {
    try {
        const people = await People.findById(request.query.id).exec();
        if (!people) {
            return { message: 'Registro no encontrado' };
        }
        return people.documents;
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.create = async (request, h) => {
    try {
        let { name, lastname, email, dni, phone, type, cargo, empresa, rut_empresa } = request.payload;
        const institution = request.auth.credentials.institution;
        const people = { name, lastname, email, dni, phone, type, institution };

        cargo && (people.cargo = cargo);
        empresa && (people.empresa = empresa);
        rut_empresa && (people.rut_empresa = rut_empresa);
        const peopleCreated = await People.create(people);

        const documents = ['CONTRATO DE TRABAJO', 'ODI', 'RIOSH', 'ENTREGA ELEMENTOS DE PROTECCION PERSONAL'];
        for (const type of documents) {
            const documentData = {
                people: peopleCreated.id,
                typeDocument: type,
                date: moment().format('DD-MM-YYYY'),
                reference: type,
                institution: institution
            };
            await Movement.create(documentData);
        }
        return peopleCreated;
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.update = async (request, h) => {
    try {
        const people = await People.findById(request.payload.id).exec();
        if (!people) {
            return { err: true, message: 'Registro no encontrado' };
        }

        people.phone = request.payload.phone || people.phone;
        people.dni = request.payload.dni || people.dni;
        people.cargo = request.payload.cargo || people.cargo || null;
        people.empresa = request.payload.empresa || people.empresa || null;
        people.rut_empresa = request.payload.rut_empresa || people.rut_empresa;
        people.dni = request.payload.dni || people.dni;
        people.name = request.payload.name || people.name;
        people.lastname = request.payload.lastname || people.lastname;
        people.email = request.payload.email || people.email;
        people.active = 'active' in request.payload ? request.payload.active : people.active;

        await people.save();
        return { err: false, message: 'Registro actualizado con exito!' };
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};
exports.remove = async (request, h) => {
    try {
        const people = await People.findById(request.payload.id).exec();
        if (!people) {
            return { err: 'Registro no encontrado' };
        }

        people.active = false;

        await people.save(people);
        return { message: 'Registro desactivado con exito!' };
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.uploadDocument = async (request, h) => {
    try {
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

                let relativePath = `public/uploads/people_documents/${people}`;

                let path = Path.resolve(__dirname, '../../', relativePath);

                relativePath = `/${relativePath}/${name}`;

                const filepath = `${path}/${name}`;
                !fs.existsSync(path) && shell.mkdir('-p', path);
                await writeFile(filepath, file);

                //SAVE IN DB

                const peopleObj = await People.findById(people).exec();
                peopleObj.documents.push({ filepath: relativePath, name, fileType, date: datetime });
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

exports.uploadDocument2 = async (request, h) => {
    try {
        const file = request.payload.file;
        const fileExtension = file.hapi.filename.split('.').pop();

        if (fileExtension !== 'xlsx') {
            return { error: true, message: 'El archivo no es un excel (.xlsx).' };
        }

        const { password: hash } = generateHash();
        const name = `staff_${hash}.xlsx`;
        const relativePath = 'public/uploads/documents/temp';
        const path = Path.resolve(__dirname, '../../', relativePath);
        const filepath = `${path}/${name}`;

        if (!fs.existsSync(path)) {
            shell.mkdir('-p', path);
        }

        fs.writeFileSync(filepath, file._data);

        const workbook = XLSX.readFile(filepath);
        const sheet_name_list = workbook.SheetNames;
        const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        for (const data of xlData) {
            const people = new People({
                name: data.NOMBRE,
                lastname: data.APELLIDO,
                dni: data.RUT,
                cargo: data.CARGO,
                phone: data.FONO,
                email: data.EMAIL,
                institution: request.auth.credentials.institution,
                type: 'TEACHER'
            });

            await people.save();
        }

        fs.unlinkSync(filepath);

        return { error: false, message: 'OK', data: xlData };
    } catch (error) {
        console.log(error);
        return { error: true, message: 'Error subiendo los archivos' };
    }
};