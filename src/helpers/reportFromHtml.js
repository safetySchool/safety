const wkhtmltopdf = require('wkhtmltopdf');

const streamToBase = require('../helpers/stream2Base64');
const config = require('../config');

module.exports = async reportContent => {
    let styles = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"><title>INFORME</title><link href="${config.publicLocalUrl}/public/assets/css/light/bootstrap.min.css" rel="stylesheet" type="text/css"><link href="${config.publicLocalUrl}/public/assets/css/light/bootstrap_limitless.min.css" rel="stylesheet" type="text/css"><link href="${config.publicLocalUrl}/public/assets/css/light/layout.min.css" rel="stylesheet" type="text/css"><style>body { font-family: Arial, "Helvetica Neue", Helvetica, sans-serif; font-size: 24px; font-style: normal; font-variant: normal; }</style><link rel="stylesheet" href="${config.publicLocalUrl}/public/app/reportTemplate/css/style.css"></head>`;
    reportContent = `${styles}<body><div class="report">${reportContent}</div></body></html>`;

    let pdfStream = await wkhtmltopdf(reportContent, {
        pageSize: 'letter',
        printMediaType: true,
        minimumFontSize: 7,
        footerCenter: 'Carampangue 492 - Manuel Rodríguez 525, San Fernando / Javiera Carrera 328, Chimbarongo (72 2 718000) \n' +
            '/ Urriola 680, Rengo, 72 2 585413 / Genaro Lisboa 398, San Vicente TT. 72 2 954894 \n' +
            'Dr. Marín 60 Coquimbo / Arturo Prat 474, Marchigue / Díaz Besoain 146 segundo piso, Santa Cruz',
        footerFontSize: 8,
        noPdfCompression: true
    });

    return await streamToBase(pdfStream);
};
