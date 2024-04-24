const pacsdb = require('../database/pacsdb');

module.exports = getStudy = async function(study) {
    const { rows } = await pacsdb.query(`
    SELECT
    CASE mods_in_study
        WHEN 'CT\\OT' THEN 'CT'
        WHEN 'CR\\OT' THEN 'CR'
        WHEN 'US\\OT' THEN 'US'
        WHEN 'MG\\OT' THEN 'MG'
        WHEN 'OT\\CT' THEN 'CT'
        WHEN 'OT\\CR' THEN 'CR'
        WHEN 'OT\\US' THEN 'US'
        WHEN 'OT\\MG' THEN 'MG'
        WHEN 'CT\\SR' THEN 'CT'
        WHEN 'SC\\CT' THEN 'CT'
        WHEN 'PR\\MR' THEN 'MR'
        WHEN 'PR\\CR' THEN 'CR'
        WHEN 'PR\\MR' THEN 'MR'
        WHEN 'PR\\DX' THEN 'DX'
        WHEN 'SC\\DX' THEN 'DX'
        WHEN 'OT\\DX' THEN 'DX'
        WHEN 'CR\\SR' THEN 'CR'
        WHEN 'MR\\SR' THEN 'MR'
        WHEN 'US\\SR' THEN 'US'
        WHEN 'US\\OT\\SR' THEN 'US'
        ELSE mods_in_study
    END AS mods_in_study,
        unnest(array_remove(array_agg( DISTINCT series.institution), NULL)) AS institution,
        to_char(study_datetime, 'YYYY-MM-DD HH24:MI:SS') AS study_datetime, orden, accession_no, study_status AS status, comment_num AS chat,
        study.study_custom1 AS prioridad, study.num_instances AS imagenes,study.study_custom3 AS critico, study.institution_temp AS "institutionTemp",
        study.study_custom4 AS comment, study.study_custom2 AS anamnesis, study_desc, study.pk, study.study_iuid as uid,
        replace(replace(pat_name, '^^^', ''), '^', ' ') AS pat_name, pat_id, patient.pat_sex AS gender, patient.pat_birthdate AS birthdate
    FROM study
    LEFT JOIN patient ON patient.pk=study.patient_fk
    LEFT JOIN series ON series.study_fk=study.pk
    WHERE study.pk=$1
    GROUP BY study_datetime, orden, accession_no, study_status, comment_num, study.study_custom1,
    study.num_instances, study.study_custom3, study.study_custom4,study.study_custom2,study_desc, study.pk, pat_name, pat_id,
    patient.pat_sex, patient.pat_birthdate, study.institution_temp
    ORDER BY study.study_datetime DESC`, [study]);
    return rows;
};
