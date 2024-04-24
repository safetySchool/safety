// ifEqualNumber Helper
var ifEqualNumber;

ifEqualNumber = function(value1, value2, context) {
    if (parseInt(value1) === parseInt(value2)) {
        return context.fn(this);
    }
    return context.inverse(this);
};

module.exports = ifEqualNumber;
