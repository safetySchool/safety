const Activity = require('../models/activities');
const Institution = require('../models/institutions');
const User = require('../models/users');
const Boom = require('@hapi/boom');
const moment = require('moment');
const shell = require('shelljs');
const Path = require('path');
const fs = require('fs');
const config = require('../config');
const { sendMailCustom } = require('../helpers/sendMail');

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

exports.list = async (request, h) => {
    try {
        return await Activity.find({ active: true }).populate('institution', { name: 1 }).exec();
    } catch (error) {
        console.log(error);
        Boom.badImplementation('Internal Error');
    }
};

exports.listByInstitutionId = async (request, h) => {
    try {
        let activity = await Activity.find({
            active: true, institution: request.params.institution
        }).populate('institution', { name: 1 }).exec();
        return activity;
    } catch (error) {
        console.log(error);
        Boom.badImplementation('Internal Error');
    }
};

exports.getById = async (request, h) => {
    try {
        const activity = await Activity.findById(request.params._id).exec();
        if (!activity) {
            return { message: 'Registro no encontrado' };
        }
        return activity;
    } catch (error) {
        return [];
    }
};

exports.create = async (request, h) => {
    try {
        const activityData = {
            name: request.payload.name,
            description: request.payload.description,
            institution: request.payload.institution
        };

        const activity = await Activity.create(activityData);
        // const user = await User.find({ role: '62842e2aa520afb3fcfae392', institution: { $in: request.auth.credentials.institution } }).populate('role', { name: 1 })
        //     .populate('institution', { name: 1 }).exec();
        // if (user.length > 0) {
        //     sendMailCustom(user[0].email, 'Nueva actividad', { activity: 'Actividad prueba', actionUrl: `${config.publicUrl}/activitiesControl`, name: user[0].name }, 'new_activity', null).then();
        // }
        return { message: 'Registro creado con exito', activity };
    } catch (error) {
        console.log(error);
        Boom.badImplementation('Internal Error');
    }
};

exports.update = async (request, h) => {
    try {
        const activity = await Activity.findById(request.payload._id).exec();
        if (!activity) {
            return { err: 'Registro no encontrado' };
        }
        activity.name = request.payload.name || activity.name;
        activity.institution = request.payload.institution || activity.institution;
        activity.description = request.payload.description || activity.description;
        await activity.save();
        return { message: 'Registro actualizado con exito!' };
    } catch (error) {
        Boom.badImplementation('Internal Error');
    }
};

exports.delete = async (request, h) => {
    try {
        const activity = await Activity.findById(request.payload._id).exec();
        if (!activity) {
            return { err: 'Registro no encontrado' };
        }
        activity.active = false;
        await activity.save();
        return { message: 'Registro actualizado con exito!' };
    } catch (error) {
        console.log(error);
        return [];
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

                let relativePath = `public/uploads/documents/${people}`;

                let path = Path.resolve(__dirname, '../../', relativePath);

                relativePath = `/${relativePath}/${name}`;

                const filepath = `${path}/${name}`;
                !fs.existsSync(path) && shell.mkdir('-p', path);
                await writeFile(filepath, file);

                const peopleObj = await Activity.findById(people).exec();
                peopleObj.files.push({ filepath: relativePath, name, fileType, date: datetime });
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

exports.getFilesByActivityId = async (request, h) => {
    try {
        const activity = await Activity.findById(request.query._id).exec();
        if (!activity) {
            return { message: 'Registro no encontrado' };
        }
        return activity.files;
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.updateDate = async (request, h) => {
    try {
        const activity = await Activity.findById(request.payload.people).exec();
        if (!activity) {
            return { err: 'Registro no encontrado' };
        }
        activity.date = request.payload.date || activity.date;
        await activity.save();
        return { message: 'Registro actualizado con exito!' };
    } catch (error) {
        return [];
    }
};

exports.validated = async (request, h) => {
    try {
        const activity = await Activity.findById(request.payload._id).exec();
        if (!activity) {
            return { err: 'Registro no encontrado' };
        }
        activity.validated = !activity.validated;
        await activity.save();
        return { message: 'Registro actualizado con exito!' };
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.getDocumentValidation = async (request, h) => {
    try {
        const activityId = request.params.activity;
        const lastValidation = await Activity.find({
            _id: activityId,
            active: true
        }).exec();
        if (lastValidation.length === 0) {
            lastValidation.validated = "Sin Documentos";
            return lastValidation;
        } else {
            let validationFalse = "";
            let validationTrue = "";
            for (let i = 0; i < lastValidation.length; i++) {
                if (lastValidation[i].validated === false) {
                    validationFalse = lastValidation[i];
                } else if (lastValidation[i].validated === true) {
                    validationTrue = lastValidation[i];
                }
            }
            if (validationFalse === "") {
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

exports.getLastMovementDate = async (request, h) => {
    try {
        const activityId = request.params.activity;
        return await Activity.find({
            _id: activityId
        }).exec();

    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};
