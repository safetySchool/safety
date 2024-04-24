const pacsdb = require('../database/pacsdb');
const db = require('../database/db');


exports.checkEntitySource = async function ({ studyPk }) {
    let sql = 'SELECT unnest(array_remove(array_agg(DISTINCT institution), NULL)) AS institution FROM series WHERE study_fk=$1 ORDER BY institution DESC';
    const { rows: institutionData } = await pacsdb.query(sql, [studyPk]);

    if (institutionData.length > 0) {
        const institutionWords = institutionData.map(i => i.institution);
        sql = 'SELECT institution.external FROM institution_word LEFT JOIN institution ON institution.pk = institution_word.institution_fk WHERE word = ANY($1::varchar[])';
        const { rows: externalData } = await db.query(sql, [institutionWords]);
        if (externalData.length > 0) {
            const { external } = externalData[0];
            return { status: 200, external };
        }
    }
    return { status: 404, external: null };
};
