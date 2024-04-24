module.exports = function() {
    let password = '';
    var string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890@$';
    for (var i = 1; i <= 8; i++) {
        pos = Math.floor((Math.random() * (string.length - 1)) + 1);
        password += string.substr(pos, 1);
    }
    return password;
};
