var jwt = require('jsonwebtoken');
const config = require('../config/index');

module.exports = generateToken = async function(req) {
    try {
        const { cliente } = req.query;
        var token = jwt.sign({
            auth: 'magic',
            agent: req.headers['user-agent'],
            name: cliente,
            exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60
        }, config.jwtSecret); // secret is defined in the environment variable JWT_SECRET
        return { token, error: false };
    } catch (error) {
        process.env.NODE_ENV === 'dev' && console.log(error);
        return { error: true };
    }
};
