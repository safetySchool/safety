const HapiCron = require('hapi-cron');

exports.plugin = {
    name: 'hapi-cron-cs',
    version: '1.0.0',
    register: async function(server, options) {
        await server.register({
            plugin: HapiCron,
            options: {
                jobs: [{
                    name: 'dailyCron',
                    time: '0 9 * * *',
                    timezone: 'America/Santiago',
                    request: {
                        method: 'POST',
                        url: '/api/cron/daily'
                    }
                }]
            }
        }, {
            plugin: HapiCron,
            options: {
                jobs: [{
                    name: 'every15Cron',
                    time: '0 9 15 * *',
                    timezone: 'America/Santiago',
                    request: {
                        method: 'POST',
                        url: '/api/cron/quartz'
                    }
                }]
            }
        });
    }
};
//CRON TODOS LOS 1 DE CADA MES A LAS 9
// 0 9 1 * *
