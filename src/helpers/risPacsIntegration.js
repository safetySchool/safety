const Fetch = require('node-fetch');

const jwt = require('../helpers/jwt');
const pacsdb = require('../database/pacsdb');
const db = require('../database/db');
const config = require('../config');

exports.assingAnamnesis = async function ({ accessionNumber, forceIntegration = false }) {
    let queryAssigned;
    let sql = 'SELECT * FROM study WHERE accession_no=$1';
    const { rows: studies } = await pacsdb.query(sql, [accessionNumber]);


    let calendarData = await Fetch(`${config.risLocalURL}/api/calendar/info/pacs_integration`, {
        body: JSON.stringify({ accessionNumber }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json());

    if (calendarData.length > 0) {
        let {
            anamnesis,
            assigned_users: loginUserAssign,
            state_fk: risState,
            priority
        } = calendarData[calendarData.length - 1];
        /* DETALLE

            **    //Si es estado es entre AGENDADO y EN ATENCIÓN lo omito
            **    //Porque se supone que aún no tiene anamnesis ni medico asignado
            **    //para estos casos, cuando se finalice en el RIS, se integrarán los resultados en el pacs

        DETALLE */
        if (![1, 2, 3, 4, 5, 6].includes(parseInt(risState))) {
            for (const study of studies) {
                const studyPk = study.pk;
                if (!study.integrated || forceIntegration) {
                    anamnesis = anamnesis || '';
                    sql = 'SELECT * FROM users WHERE login=$1';
                    let userAssign = null;

                    if (loginUserAssign && loginUserAssign !== '') {
                        const { rows: userData } = await db.query(sql, [loginUserAssign]);
                        if (userData.length === 1) {
                            userAssign = userData[0].pk;
                        }
                    }
                    if (userAssign) {
                        const { study_status: studyStatus } = study;
                        const queryStatus = parseInt(studyStatus) <= 1 ? ', study_status=1' : '';
                        queryAssigned = userAssign ? `, users_assign=${userAssign}${queryStatus}` : '';
                    }
                    priority = priority === 'URGENCIA' ? '6 Horas' : '';
                    sql = `UPDATE study
                           SET study_custom2=$1,
                               integrated= true,
                               study_custom1=$2 ${queryAssigned}
                           WHERE pk = $3`;
                    await pacsdb.query(sql, [anamnesis, priority, studyPk]);
                }
            }
        }
    }
};
exports.benefitsIntegration = async function ({ accessionNumber }) {

    let sql = 'SELECT * FROM study WHERE accession_no=$1';
    const { rows: studies } = await pacsdb.query(sql, [accessionNumber]);


    let calendarData = await Fetch(`${config.risLocalURL}/api/calendar/info/pacs_integration`, {
        body: JSON.stringify({ accessionNumber }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json());
    if (calendarData.length > 0) {

        let { exams } = calendarData[calendarData.length - 1];

        for (const study of studies) {
            const studyPk = study.pk;
            const { rows: studyExamsValidated } = await pacsdb.query('SELECT * FROM  study_exams WHERE study_fk=$1 AND report_fk IS NOT NULL', [studyPk]);
            if (studyExamsValidated.length === 0) {
                await pacsdb.query('DELETE FROM study_exams WHERE study_fk=$1', [studyPk]);
                for (const { calendar_benefits: cbenefits, name, pk } of exams) {
                    await pacsdb.query('INSERT INTO study_exams (study_fk, benefit_fk, benefit_name, calendar_benefit) VALUES ($1, $2, $3, $4)', [studyPk, pk, name, cbenefits]);
                }
            }
        }
    }
};

exports.repotValidatedIntegration = async function ({ studyPk }) {
    try {
        console.log('Codesud RIS Integration');
        const sql = 'SELECT * FROM study WHERE pk=$1';
        const { rows: studyData } = await pacsdb.query(sql, [studyPk]);
        const { rows: studyExamData } = await pacsdb.query('SELECT DISTINCT accession_no AS "accessionNumber" FROM study_exams WHERE study_fk=$1 AND accession_no IS NOT NULL LIMIT 1', [studyPk]);
        let { accession_no: accNumber } = studyData[0];
        let accessionNumber = studyExamData.length === 1 ? studyExamData[0].accessionNumber : accNumber;

        const { rows: reports } = await db.query('SELECT report.pk, COALESCE(users.login, users_type.login) AS login FROM report LEFT JOIN users ON users.pk=report.users_validate_fk LEFT JOIN users AS users_type ON users_type.pk=report.users_type_fk WHERE study=$1', [studyPk]);
        for (const report of reports) {
            const { rows: studyExams } = await pacsdb.query('SELECT * FROM study_exams WHERE report_fk=$1', [report.pk]);
            let benefitsReport = studyExams.map(({ calendar_benefit: cbenefit }) => cbenefit);
            let token = await jwt.sign({ pk: report.pk });
            let url = `${config.publicLocalUrl}/report/view/${token}`;
            await Fetch(`${config.risLocalURL}/api/pacs_integration/report/validate`, {
                body: JSON.stringify({
                    accessionNumber,
                    benefitsReport,
                    url,
                    login: report.login
                }), method: 'POST', headers: { 'Content-Type': 'application/json' }
            }).then(res => res.json());
        }
    } catch (error) {
        console.log(error);
    }
};
