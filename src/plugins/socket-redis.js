const config = require('../config/index');
const redisAdapter = require('socket.io-redis');

module.exports = {
    name: 'SocketCluster',
    register: function(server, options) {
        const io = require('socket.io')(server.listener);
        io.adapter(redisAdapter({ host: config.redisHost, port: 6379 }));

        io.on('connection', function(socket) {
            socket.on('chat', function(message) {
                socket.broadcast.emit('chat', {
                    message
                });
            });
            socket.on('report', function(message) {
                socket.broadcast.emit('report', {
                    message
                });
            });
        });
    }
};
