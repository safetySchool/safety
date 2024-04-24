const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    isSecure: process.env.NODE_ENV === 'production',
    localUrl: `http://localhost:${process.env.PORT || 3000}`,
    publicUrl: process.env.PUBLIC_URL || 'https://safetyschool.codesud.cl',
    SALT_WORK_FACTOR: 11,
    cookiePassword: process.env.COOKIE_PASSWORD,
    mongoUri: process.env.MONGO_URI,
    secret: process.env.JWT_SECRET,
    jwtSecret: process.env.JWT_SECRET,
    redisHost: process.env.REDIS_HOST || 'localhost',
    mailService: process.env.SERVICE_EMAIL || null,
    userMail: process.env.SENDER_EMAIL || 'asistencia@codesud.com',
    passMail: process.env.PASSWORD_EMAIL || 'Eq@iE77dp+tr.cj',
    fromMail: process.env.SENDER_EMAIL || 'asistencia@codesud.com',
    smtpHost: process.env.SMTP_HOST || 'smtp.office365.com',
    smtpPort: process.env.SMTP_PORT || 587
};
