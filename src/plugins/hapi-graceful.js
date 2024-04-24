module.exports = {
    name: 'HapiGraceful',
    register: async function(Server, options) {
        try {
            process.on('SIGINT', async () => {
                Server.log(['info', 'pm2', 'shutdown'], 'stopping hapi...');
                await Server.stop(options);
                Server.log(['info', 'pm2', 'shutdown'], 'hapi stopped');

                return process.exit(0);
            });
        } catch (error) {
            console.log(error);
        }
    }
};
