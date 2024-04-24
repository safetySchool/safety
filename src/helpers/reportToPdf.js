const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const pdf = require('../plugins/html-pdf');
const db = require('../database/db');
const config = require('../config/index');

module.exports = (reportData) => {
    return new Promise(function (resolve, reject) {
        const sql = 'SELECT * FROM report WHERE pk=$1';
        db.query(sql, [reportData.pk]).then((result) => {
            let rows = result.rows;
            let report = rows[0];
            let html = '%title% %tech% %records% %findings% %impression%';
            report.findings = report.findings.replace(/’/g, '\'');
            html = html.replace('%findings%', report.findings ? `<b>HALLAZGOS:</b><br /><div style="white-space: pre-wrap;">${report.findings}</div><br />` : '');
            html = html.replace('%records%', report.records ? `<b>ANTECEDENTES:</b><br /><div style="white-space: pre-wrap;">${report.records}</div><br />` : '');
            html = html.replace('%impression%', report.impression ? `<b>IMPRESIÓN:</b><br /><div style="white-space: pre-wrap;">${report.impression}</div><br />` : '');
            html = html.replace('%tech%', report.technique ? `<b>TÉCNICA:</b><br /><div style="white-space: pre-wrap;">${report.technique}</div><br />` : '');
            html = html.replace('%title%', report.title ? `<h3 style="text-align: center;"><u>${report.title}</u></h3><br />` : '');
            if (report.adendum) {
                html += `ADENDUMS:</b><div style="white-space: pre-wrap;">${report.adendum_text}</div><br />`;
            }

            const Templates = path.resolve(__dirname, '../', 'templates');
            const templatePath = path.resolve(Templates, 'reportTemplate.html');
            const templateHtml = fs.readFileSync(templatePath, 'utf8');
            const template = handlebars.compile(templateHtml);
            let isTyped = !report.validated;
            const finalHtml = template({ reportHtml: `${report.header}<br>${html}`, footer: report.footer, isTyped });

            const options = {
                format: 'Letter',
                border: {
                    top: '0.3in',
                    bottom: '0.3in',
                    right: '0.7in',
                    left: '0.7in'
                }
            };
            config.phantomPath !== '' && (options.phantomPath = config.phantomPath);

            pdf.create(`${finalHtml}<br>`, options).toFile(`./public/uploads/pdf/${report.pk}.pdf`, function (err, res) {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
            });
        });
    });
};
