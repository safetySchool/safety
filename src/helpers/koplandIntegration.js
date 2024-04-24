const Fetch = require('node-fetch');
const fs = require('fs');
const hl7parser = require('hl7parser');
const hl7 = require('simple-hl7');
const moment = require('moment');
const uuid = require('uuid');

const pacsdb = require('../database/pacsdb');
const db = require('../database/db');
const config = require('../config');
const reportToBase64 = require('../helpers/reportBase64');

exports.loadData = async function ({ accessionNumber }) {
    try {
        let calendarData = await Fetch(`${config.koplandUrl}/~integracion/Isalud-RIS/detalleOrden?idorden=${accessionNumber}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'api-key': config.koplanKey }
        }).then(res => res.text());
        calendarData = calendarData.replace('\t', '');
        calendarData = JSON.parse(calendarData);

        if (typeof calendarData === 'object' && calendarData !== null) {

            let { Anamnesis: anamnesis, idProfesional, Prioridad: priority, exams } = calendarData;
            //idProfesional = '5499';
            let data = { idOrden: accessionNumber, idProfesional, priority, exams };
            (anamnesis && anamnesis !== '') && (data.anamnesis = anamnesis);

            let response = await Fetch(`${config.codesudExternalApi}/api/v1/integration/exams`, {
                body: JSON.stringify(data),
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': config.codesudExternalKey }
            }).then(res => res.json());
            console.log({ response });

            return response;
        }
        return {};
    } catch (e) {
        console.log(e);
        throw e;
    }
};


exports.sendReport = async function ({ studyPk }) {
    console.log('send report KOPLAND');

    const date = moment().format('YYYYMMDDHHmmss');

    let { rows: studyData } = await pacsdb.query(`
        SELECT p.pat_id                                        AS dni,
               replace(replace(pat_name, '^^^', ''), '^', ' ') AS "patientName",
               p.pat_birthdate                                 AS birthdate,
               study_datetime                                  AS "studyDate",
               mods_in_study                                   AS modality
        FROM study
                 LEFT JOIN patient p ON study.patient_fk = p.pk
        WHERE study.pk = $1`, [studyPk]);

    let { dni, patientName, birthdate, studyDate, modality } = studyData[0];

    const { rows: reports } = await db.query(`
        SELECT report.pk, COALESCE(users.external_code, users_type.external_code) AS "IdProfesional"
        FROM report
                 LEFT JOIN users ON users.pk = report.users_validate_fk
                 LEFT JOIN users AS users_type ON users_type.pk = report.users_type_fk
        WHERE study = $1`, [studyPk]);

    for (const { pk: reportPk, IdProfesional } of reports) {

        let b64 = await reportToBase64(reportPk);

        const { rows: studyExams } = await pacsdb.query(`
            SELECT study_fk         AS "studyPk",
                   calendar_benefit AS "IdPrestacion",
                   accession_no     AS "IdOrden",
                   code,
                   benefit_name     AS "NombrePrestacion"
            FROM study_exams
            WHERE report_fk = $1`, [reportPk]);

        for (const { studyPk, IdPrestacion, IdOrden, code, NombrePrestacion } of studyExams) {

            let message = hl7parser.create(`MSH|^~\&|CODESUD|ISALUD|KPD|ISALUD|${date}||ORU^R01|${uuid.v4()}||2.3.1`);

            message.addSegment('PID');
            message.set('PID.3.1', dni);
            message.set('PID.3.5', 'RUN');
            message.set('PID.5', patientName);
            message.set('PID.7', birthdate || '');

            message.addSegment('PV1');
            message.set('PV1.2', 'O');
            message.set('PV1.19', IdOrden);

            message.addSegment('ORC');
            message.set('ORC.1', 'NW');
            message.set('ORC.2', IdPrestacion);
            message.set('ORC.3', studyPk);
            message.set('ORC.7', date);
            message.set('ORC.9', date);

            message.addSegment('OBR');
            message.set('OBR.2', IdPrestacion);
            message.set('OBR.3', studyPk);
            message.set('OBR.4.1', code);
            message.set('OBR.4.2', NombrePrestacion);
            message.set('OBR.7', moment(studyDate).format('YYYYMMDDHHmmss'));
            message.set('OBR.24', modality.substring(0, 2));

            message.addSegment('OBX');
            message.set('OBX.2', 'ED');
            message.set('OBX.3.1', code);
            message.set('OBX.3.2', NombrePrestacion);
            message.set('OBX.5', b64);
            message.set('OBX.11', 'F');
            message.set('OBX.14', moment(studyDate).format('YYYYMMDDHHmmss'));
            message.set('OBX.16', IdProfesional);


            let hl7Client = hl7.Server.createTcpClient(config.koplandHl7Server, config.koplanHL7Port);
            console.log('Antes de enviar Hl7');
            hl7Client.send(message.toString(), function (err, ack) {
                console.log('Hl7 enviado');
                err && console.log('Error en envío', reportPk);
                let action = err ? 'HL7_ERROR' : 'HL7';
                db.query(`INSERT INTO logs (users_fk, datetime, table_name, table_id, action, comment)
                          VALUES (1, $1, 'REPORT', $2, $3, $4)`, [moment().format('YYYY-MM-DD HH:mm:ss'), reportPk, action, ack.toString()]);
            });
        }
    }
};

exports.getMedicalOrder = async function ({ accessionNumber }) {
    return await Fetch(`${config.koplandUrl}/~integracion/Isalud-RIS/scanOrdenes?idOrden=${accessionNumber}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'api-key': config.koplanKey }
    }).then(res => res.json());
};
exports.getHistoryReport = async function ({ dni }) {
    return await Fetch(`${config.koplandUrl}/~integracion/Isalud-RIS/historialInformes?rutPaciente=${dni}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'api-key': config.koplanKey }
    }).then(res => res.json());
};
