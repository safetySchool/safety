const Bcrypt = require('bcryptjs');

const config = require('../config');

module.exports = function (password) {
    password = password || '';
    if (password === '') {
        const string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
        for (let i = 1; i <= 8; i++) {
            let pos = Math.floor((Math.random() * (string.length - 1)) + 1);
            password += string.substr(pos, 1);
        }
    }
    const salt = Bcrypt.genSaltSync(config.SALT_WORK_FACTOR);
    const hash = Bcrypt.hashSync(password, salt);
    return {hash, password};
};
