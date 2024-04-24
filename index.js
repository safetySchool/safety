'use strict';

const Hapi = require('@hapi/hapi');
const Dotenv = require('dotenv');
const Handlebars = require('handlebars');
const Extend = require('handlebars-extend-block');
const Inert = require('@hapi/inert');

Dotenv.config();

let Server = new Hapi.Server({
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 3000,
    debug: false
});

(async () => {
    try {
        // await Server.register({
        //     plugin: require('hapi-pino'),
        //     options: {
        //         prettyPrint: process.env.NODE_ENV !== 'production',
        //         redact: ['req.headers.authorization'],
        //         allTags: 'info',
        //         level: 'info',
        //         logPayload: true,
        //         logRequestStart: true
        //     }
        // });
        await Server.register({ plugin: require('./src/plugins/session') });
        await Server.register({ plugin: require('./src/plugins/jwt-server') });
        await Server.register({ plugin: require('./src/plugins/local-mongodb') });
        await Server.register({ plugin: require('./src/plugins/hapi-graceful') });
        await Server.register({ plugin: require('@hapi/vision') });
        await Server.register(Inert);
        await Server.register({ plugin: require('./src/plugins/hapi-router'), options: { routes: 'src/routes/**/*.js' } });
        await Server.register({ plugin: require('./src/plugins/serverExt') });

        // noinspection JSUnresolvedFunction
        Server.views({
            engines: {
                hbs: {
                    module: Extend(Handlebars),
                    isCached: process.env.NODE_ENV === 'production'
                }
            },
            defaultExtension: 'hbs',
            path: 'src/views',
            layoutPath: 'src/views/layout',
            layout: 'default',
            helpersPath: 'src/views/helpers',
            partialsPath: 'src/views/partials'
        });

        await Server.start();
        console.log('Server running at: ', Server.info.uri);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
})();
