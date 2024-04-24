const jwt = require('jsonwebtoken');
const config = require('../config');

exports.sign = function(object) {
    return new Promise(function(resolve, reject) {
        jwt.sign(object, config.jwtSecret, function(err, token) {
            if (err) { return reject(err); }
            resolve(token);
        });
    });
};

exports.verify = function(token) {
    return new Promise(function(resolve, reject) {
        jwt.verify(token, config.jwtSecret, function(err, decoded) {
            if (err) { return reject(err); }
            resolve(decoded);
        });
    });
};
