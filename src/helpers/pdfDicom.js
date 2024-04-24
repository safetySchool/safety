const moment = require('moment');
const shell = require('shelljs');
const fs = require('fs');

const db = require('../database/db');
const pacsdb = require('../database/pacsdb');
const config = require('../config');
const reportToFile = require('../helpers/reportToFile');

function runCmd(cmd) {
    return new Promise(function (resolve) {
        shell.exec(cmd, function (code, stdout, stderr) {
            resolve({ code, stdout, stderr });
        });
    });
}

module.exports = async (reportPk, studyPk) => {
    try {
        if (process.env.NODE_ENV === 'dev') {
            return { error: false };
        }
        let file = await reportToFile(reportPk);

        let path = 'public/uploads/pdf/';
        const { rows } = await pacsdb.query('SELECT filepath FROM files WHERE instance_fk IN (SELECT pk FROM instance WHERE series_fk IN (SELECT pk FROM series WHERE study_fk = $1)) LIMIT 1 ', [studyPk]);
        let dcmBase = `/var/dcm4chee/server/default/archive/${rows[0].filepath}`;
        //let dcmBase = '/Users/siarcarse/0ACCF85C';
        let dicomFile = `${reportPk}_${moment().format('YYYY_MM_DD_HH_MM_SS')}.dcm`;
        let out = await runCmd(`pdf2dcm +t "INFORME_${moment().format('YYYY_MM_DD HH_MM_SS')}" +st ${dcmBase} ${file.path} ${path}${dicomFile}`);
        fs.unlinkSync(file.path);
        if (out.code === 0) {
            let out = await runCmd(`dcmodify ${path}${dicomFile} -i "(0008,103E)=INFORME_${moment().format('YYYY_MM_DD HH_MM_SS')}" -i "(0008,0060)=OT" -nb ${path}${dicomFile}`);
            if (out.code === 0) {
                let out = await runCmd(`dcmdump +P "0020,000E" ${path}${dicomFile}`);
                if (out.code === 0) {
                    let seriesUid = out.stdout.split('[')[1].split(']')[0];
                    if (seriesUid) {
                        let sql = 'UPDATE report SET series_uid=$1 WHERE pk=$2';
                        await db.query(sql, [seriesUid, reportPk]);
                        await runCmd(`dcmsend ${config.dcmHost} ${config.dcmPort} -aec ${config.dcmAetitle} ${path}${dicomFile}`);
                        fs.unlinkSync(`${path}${dicomFile}`);
                        return { error: false };
                    }
                    return { error: true, message: 'Error leyendo atributos dicom' };
                }
                return { error: true, message: 'Error leyendo atributos dicom' };
            }
            return { error: true, message: 'Error creando archivo DICOM' };
        }
        return { error: true, message: 'Error creando archivo DICOM' };
    } catch (e) {
        console.log(e);
        return { error: true, message: 'Error creando archivo DICOM' };
    }
};
