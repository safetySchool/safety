const Fs = require('fs');
const Path = require('path');
const Util = require('util');
const Nodemailer = require('nodemailer');
const ReadFile = Util.promisify(Fs.readFile);
const Handlebars = require('handlebars');
const HtmlToText = require('html-to-text');
const Boom = require('@hapi/boom');

const config = require('../config');

let mailConfig = {
    auth: {
        user: config.userMail,
        pass: config.passMail
    }
};
if (config.mailService) {
    mailConfig.service = config.mailService;
}
if (config.smtpHost) {
    mailConfig.host = config.smtpHost;
    mailConfig.port = config.smtpPort;
}
const Transporter = Nodemailer.createTransport(mailConfig);

const Templates = Path.resolve(__dirname, '..', 'views/app', 'email-templates');

async function prepareTemplate(options = {}, templateName) {
    try {
        const templatePath = Path.resolve(Templates, templateName);
        const content = await ReadFile(templatePath, 'utf8');

        const template = Handlebars.compile(content);
        const html = template(options);

        // generate a plain-text version of the same email
        const text = HtmlToText.fromString(html);

        return {
            html,
            text
        };
    } catch (error) {
        console.log(error);
        throw Boom.badImplementation('Cannot read the email template content.');
    }
}

/**
 * @param  {String} email Mail del o los receptores del mail (para más de uno, separar con punto y coma)
 * @param  {String} subject Asunto del mail
 * @param  {Object} data Objeto que contiene los parametros usados por la plantilla de mail
 * @param  {String} template Nombre de la plantilla de correo (no incluir la extensión .html)
 * @param  {Array} attachments URLs de archivos adjuntos
 */
exports.sendMailCustom = async function (email, subject, data, template, attachments) {
    const { html, text } = await prepareTemplate(data, `${template}.hbs`);
    const mailOptions = {
        from: `Safety School <${config.userMail}>`,
        to: email,
        subject: subject,
        html,
        text,
        attachments
    };

    try {
        await Transporter.sendMail(mailOptions);
    } catch (err) {
        console.log(err);
    }
};
