const wkhtmltopdf = require('wkhtmltopdf');
const fs = require('fs');

const jwt = require('../helpers/jwt');
const config = require('../config');

module.exports = async reportPk => {
    let token = await jwt.sign({ pk: reportPk });
    const writeStream = fs.createWriteStream(`./public/uploads/pdf/${reportPk}.pdf`);
    wkhtmltopdf(`${config.publicLocalUrl}/report/view/${token}`, {
        pageSize: 'letter',
        printMediaType: true,
        minimumFontSize: 7,
        footerCenter: 'Carampangue 492 - Manuel Rodríguez 525, San Fernando / Javiera Carrera 328, Chimbarongo (72 2 718000) \n' +
            '/ Urriola 680, Rengo, 72 2 585413 / Genaro Lisboa 398, San Vicente TT. 72 2 954894 \n' +
            'Dr. Marín 60 Coquimbo / Arturo Prat 474, Marchigue / Díaz Besoain 146 segundo piso, Santa Cruz',
        footerFontSize: 8,
        noPdfCompression: true
    }).pipe(writeStream);

    return new Promise((resolve, reject) => {
        writeStream.on('finish', () => {
            return resolve({ path: `./public/uploads/pdf/${reportPk}.pdf` });
        });
    });
};
