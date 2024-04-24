// parseJson helper — for demonstration purposes
var ifCondNumber;

ifCondNumber = function(v1, v2, options) {
    if (parseInt(v1) === parseInt(v2)) {
        return options.fn(this);
    }
    return options.inverse(this);
};

module.exports = ifCondNumber;
