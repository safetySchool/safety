const db = require('../database/db');

module.exports = (reportData) => {
    return new Promise(function (resolve, reject) {
        const sql = 'SELECT * FROM report WHERE pk=$1';
        db.query(sql, [reportData.pk]).then((result) => {
            let rows = result.rows;
            const report = rows[0];
            if (!report.full_version) {
                let html = '%title% %tech% %records% %findings% %impression%';
                report.findings = report.findings.replace(/’/g, '\'');
                html = html.replace('%findings%', report.findings ? `<b>HALLAZGOS:</b><br /><br /><div style="white-space: pre-wrap;">${report.findings}</div><br />` : '');
                html = html.replace('%records%', report.records ? `<b>ANTECEDENTES:</b><br /><br /><div style="white-space: pre-wrap;">${report.records}</div><br />` : '');
                html = html.replace('%impression%', report.impression ? `<b>IMPRESIÓN:</b><br /><br /><div style="white-space: pre-wrap;">${report.impression}</div><br />` : '');
                html = html.replace('%tech%', report.technique ? `<b>TÉCNICA:</b><br /><br /><div style="white-space: pre-wrap;">${report.technique}</div><br />` : '');
                html = html.replace('%title%', report.title ? `<h3 style="text-align: center;"><u>${report.title.toUpperCase()}</u></h3><br />` : '');
                if (report.adendum) {
                    html += `ADENDUMS:</b><div style="white-space: pre-wrap;">${report.adendum_text}</div><br />`;
                }

                let isTyped = !report.validated;

                return resolve({
                    reportHtml: `${report.header}<br>${html}`,
                    footer: report.footer,
                    isTyped,
                    studyPk: report.study,
                    fullVersion: report.full_version
                });
            } else {
                let isTyped = !report.validated;

                return resolve({
                    reportHtml: report.content_full,
                    isTyped,
                    studyPk: report.study,
                    fullVersion: report.full_version
                });
            }
        });
    });
};
