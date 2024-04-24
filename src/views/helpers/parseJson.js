// parseJson helper — for demonstration purposes
let _ = require('lodash'),
    parseJson;

parseJson = function(options, context) {
    return JSON.stringify(options);
};

module.exports = parseJson;
