const Boom = require('@hapi/boom');
const moment = require('moment');
const shell = require('shelljs');
const Path = require('path');
const fs = require('fs');

const Accident = require('../models/accident');
const Casuistry = require('../models/casuistries');
const generateHash = require('../helpers/generatePassword');
const Movement = require('../models/accident_movement');

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
        const accident = await Accident.find({
            active: true, institution: request.auth.credentials.institution
        }).populate('casuistry', { name: 1 }).exec();
        return accident;
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.listGroup = async (request, h) => {
    try {
        const accident = await Accident.find({
            active: true
        }).exec();
        let types = [];
        accident.map((item) => {
            types = [...types, item.type];
        });
        types = [...new Set(types)];
        return types;
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.yearsByAccident = async (request, h) => {
    try {
        const accident = await Accident.find({
            active: true
        }).exec();
        let years = [];
        accident.map((item) => {
            years = [...years, moment(item.date).format('YYYY')];
        });
        years = [...new Set(years)];
        years.sort((a, b) => {
            return a - b;
        });
        return years;
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.quantityBySelectLostDays = async (request, h) => {
    try {
        let { typeAccident, lostDaysYears } = request.params;
        lostDaysYears = lostDaysYears.split(',');
        let lostDaysByYear = [];
        if (typeAccident === 'ACCIDENTE') {
            for (const item of lostDaysYears) {
                let accident = await Accident.find({
                    active: true, type: { $ne: 'ACCIDENTE ESCOLAR' }, date: { $gte: new Date(`${item}-01-01`), $lt: new Date(`${item}-12-31`) }
                }).exec();
                let lostDaysByMonth = [];
                for (let i = 1; i <= 12; i++) {
                    let accidentByMonthFilter = accident.filter((item) => {
                        return moment(item.date).format('MM') == i;
                    });
                    let lostDays = 0;
                    accidentByMonthFilter.map((item) => {
                        lostDays = lostDays + item.days;
                    });
                    lostDaysByMonth = [...lostDaysByMonth, lostDays];
                }
                const data = {
                    label: item,
                    data: lostDaysByMonth
                };
                lostDaysByYear = [...lostDaysByYear, data];
            }
        } else if (typeAccident === 'ACCIDENTE ESCOLAR') {
            for (const item of lostDaysYears) {
                let accident = await Accident.find({
                    active: true, type: 'ACCIDENTE ESCOLAR', date: { $gte: new Date(`${item}-01-01`), $lt: new Date(`${item}-12-31`) }
                }).exec();
                let lostDaysByMonth = [];
                for (let i = 1; i <= 12; i++) {
                    let accidentByMonthFilter = accident.filter((item) => {
                        return moment(item.date).format('MM') == i;
                    });
                    let lostDays = 0;
                    accidentByMonthFilter.map((item) => {
                        lostDays = lostDays + item.days;
                    });
                    lostDaysByMonth = [...lostDaysByMonth, lostDays];
                }
                const data = {
                    label: item,
                    data: lostDaysByMonth
                };
                lostDaysByYear = [...lostDaysByYear, data];
            }
        }
        return lostDaysByYear;
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.quantityByAccidentName = async (request, h) => {
    try {
        let { type, accidentYears } = request.params;
        accidentYears = accidentYears.split(',');
        let accidentByYear = [];
        for (const item of accidentYears) {
            let accident = await Accident.find({
                active: true, type, date: { $gte: new Date(`${item}-01-01`), $lt: new Date(`${item}-12-31`) }
            }).exec();
            let accidentByMonth = [];
            for (let i = 1; i <= 12; i++) {
                let accidentByMonthFilter = accident.filter((item) => {
                    return moment(item.date).format('MM') == i;
                });
                accidentByMonth = [...accidentByMonth, accidentByMonthFilter.length];
            }
            const data = {
                label: item,
                data: accidentByMonth
            };
            accidentByYear = [...accidentByYear, data];
        }
        return accidentByYear;
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.QuantityWorkAccidentCaseByYear = async (request, h) => {
    try {
        let { year } = request.params;
        let casuistry = await Casuistry.find({ active: true }, { id: 1 }).exec();
        casuistry = casuistry.map((item) => {
            return item.id.toString();
        });

        let accident = await Accident.find({
            active: true, type: 'ACCIDENTE LABORAL',
            date: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year}-12-31`) }
        }).exec();
        let accidentByCase = [];
        for (const item of casuistry) {
            let accidentByCaseFilter = accident.filter((itemAccident) => {
                return itemAccident.casuistry.toString() === item;
            });
            accidentByCase = [...accidentByCase, accidentByCaseFilter.length];
        }
        data = [{
            data: accidentByCase,
        }];
        return data;
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.QuantitySchoolAccidentCaseByYear = async (request, h) => {
    try {
        let { year } = request.params;
        let casuistry = await Casuistry.find({ active: true }, { id: 1 }).exec();
        casuistry = casuistry.map((item) => {
            return item.id.toString();
        });

        let accident = await Accident.find({
            active: true, type: 'ACCIDENTE ESCOLAR',
            date: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year}-12-31`) }
        }).exec();
        let accidentByCase = [];
        for (const item of casuistry) {
            let accidentByCaseFilter = accident.filter((itemAccident) => {
                return itemAccident.casuistry.toString() === item;
            });
            accidentByCase = [...accidentByCase, accidentByCaseFilter.length];
        }
        data = [{
            data: accidentByCase,
        }];
        return data;
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.get = async (request, h) => {
    try {
        const accident = await Accident.findById(request.params.id).exec();
        if (!accident) {
            return { message: 'Registro no encontrado' };
        }
        return accident;
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.getDocuments = async (request, h) => {
    try {
        const accident = await Accident.findById(request.query.id).exec();
        if (!accident) {
            return { message: 'Registro no encontrado' };
        }
        return accident.documents;
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.create = async (request, h) => {
    try {
        let { name, date, dateUp, days, dni, cargo, type, casuistry } = request.payload;
        const institution = request.auth.credentials.institution;
        const accident = { name, date, dateUp, days, dni, institution, casuistry };

        cargo && (accident.cargo = cargo);
        type && (accident.type = type);

        const accidentData = await Accident.create(accident);

        const documents = ['INVESTIGACIÓN ACCIDENTE/ENFERMEDAD', 'EVIDENCIA IMPLEMENTACIÓN MEDIDA DE CONTROL', 'DIAT/DIEP'];
        for (const type of documents) {
            const documentData = {
                accident: accidentData.id,
                typeDocument: type,
                date: moment().format('DD-MM-YYYY'),
                reference: type,
                institution: institution
            };
            await Movement.create(documentData);
        }

        return accidentData;
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.update = async (request, h) => {
    try {
        const accident = await Accident.findById(request.payload.id).exec();
        if (!accident) {
            return { err: true, message: 'Registro no encontrado' };
        }

        accident.date = request.payload.date || accident.date;
        accident.type = request.payload.type || accident.type;
        accident.casuistry = request.payload.casuistry || accident.casuistry;
        accident.dateUp = request.payload.dateUp || accident.dateUp;
        accident.dni = request.payload.dni || accident.dni;
        accident.cargo = request.payload.cargo || accident.cargo || null;
        accident.name = request.payload.name || accident.name;
        accident.days = request.payload.days || accident.days;
        accident.active = 'active' in request.payload ? request.payload.active : accident.active;

        await accident.save();
        return { err: false, message: 'Registro actualizado con exito!' };
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};
exports.remove = async (request, h) => {
    try {
        const accident = await Accident.findById(request.payload.id).exec();
        if (!accident) {
            return { err: 'Registro no encontrado' };
        }

        accident.active = false;

        await accident.save();
        return { message: 'Registro desactivado con exito!' };
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.uploadDocument = async (request, h) => {
    try {
        let datetime = moment().format('YYYY-MM-DD HH:mm:ss');
        let { files, accident } = request.payload;
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

                let relativePath = `public/uploads/accident_documents/${accident}`;

                let path = Path.resolve(__dirname, '../../', relativePath);

                relativePath = `/${relativePath}/${name}`;

                const filepath = `${path}/${name}`;
                !fs.existsSync(path) && shell.mkdir('-p', path);
                await writeFile(filepath, file);

                //SAVE IN DB

                const accidentObj = await Accident.findById(accident).exec();
                accidentObj.documents.push({ filepath: relativePath, name, fileType, date: datetime });
                await accidentObj.save();
            }
            return { error: false, rowsDb };
        }
        return { message: 'ok' };
    } catch (error) {
        console.log(error);
        return { error: true, message: 'Error subiendo los archivos' };
    }
};
