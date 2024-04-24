'use strict';

// Load modules

const Boom = require('@hapi/boom');
const Hoek = require('@hapi/hoek');
const Joi = require('@hapi/joi');
const Bounce = require('@hapi/bounce');
const Redis = require('redis');
const Bluebird = require('bluebird');
const config = require('../config/index');

Bluebird.promisifyAll(Redis.RedisClient.prototype);
Bluebird.promisifyAll(Redis.Multi.prototype);

// Declare internals

const internals = {};

module.exports = {
    name: 'Session',
    register: (server, options) => {

        server.auth.scheme('cookie', internals.implementation);
        server.auth.strategy('session', 'cookie', {
            password: config.cookiePassword,
            cookie: 'codesud-bicentenario',
            redis: {
                host: config.redisHost,
                db: 5,
                port: 6379
            },
            redirectTo: '/login',
            isSecure: config.isSecure,
            appendNext: false,
            ttl: 3 * 60 * 60 * 1000,
            validateFunc: async (request, session, client, cookieName) => {
                var cached = await client.getAsync(`${cookieName}:${session.key}`);
                const out = {
                    valid: !!cached
                };
                if (out.valid) {
                    cached = JSON.parse(cached);
                    out.credentials = cached;
                }
                return out;
            }
        });
        server.auth.default('session');
    }
};

internals.schema = Joi.object({
    cookie: Joi.string().default('sid'),
    redis: Joi.object().keys({
        host: Joi.string().required(),
        port: Joi.number().integer().min(1).max(65535).required(),
        db: Joi.number().integer().min(0).max(255).required(),
        password: Joi.string()
    }).required(),
    password: Joi.alternatives(Joi.string(), Joi.binary()).required(),
    ttl: Joi.number().integer().min(0).allow(null).when('keepAlive', { is: true, then: Joi.required() }),
    domain: Joi.string().allow(null),
    path: Joi.string().default('/'),
    clearInvalid: Joi.boolean().default(false),
    keepAlive: Joi.boolean().default(false),
    isSameSite: Joi.valid('Strict', 'Lax').allow(false).default('Strict'),
    isSecure: Joi.boolean().default(true),
    isHttpOnly: Joi.boolean().default(true),
    redirectTo: Joi.alternatives(Joi.string(), Joi.func()).allow(false),
    appendNext: Joi.alternatives(Joi.string(), Joi.boolean()).default(false),
    validateFunc: Joi.func(),
    requestDecoratorName: Joi.string().default('cookieAuth'),
    ignoreIfDecorated: Joi.boolean().default(true)
}).required();

internals.CookieAuth = class {

    constructor(request, settings, client) {
        this.request = request;
        this.settings = settings;
        this.client = client;
    }

    async set(session, value) {
        const { h, request, settings, client } = this;
        if (arguments.length > 1) {
            const key = session;
            Hoek.assert(key && typeof key === 'string', 'Invalid session key');
            session = request.auth.artifacts;
            Hoek.assert(session, 'No active session to apply key to');

            session[key] = value;
            h.state(settings.cookie, session);
            return await client.setAsync(`${settings.cookie}:${key.key}`, JSON.stringify(session));
            return h.state(settings.cookie, session);
        }
        var key = session.key;
        Hoek.assert(session && typeof session === 'object', 'Invalid session');

        client.setAsync(`${settings.cookie}:${key}`, JSON.stringify(session));
        client.expireAsync(`${settings.cookie}:${key}`, settings.ttl);
        request[settings.requestDecoratorName].h.state(settings.cookie, key);
        request.auth.artifacts = session;
        h.state(settings.cookie, session);
    }

    async clear(key) {
        try {
            const { h, request, settings, client } = this;
            if (arguments.length) {
                Hoek.assert(key && typeof key === 'string', 'Invalid session key');
                const session = request.auth.artifacts;
                Hoek.assert(session, 'No active session to clear key from');
                delete session[key];
                await client.expireAsync(`${settings.cookie}:${key}`, 0);
                return request[settings.requestDecoratorName].h.state(settings.cookie, (session));
            }
            request.auth.artifacts = null;
            if (settings.cookie.clearInvalid) {
                request[settings.requestDecoratorName].h.unstate(settings.cookie);
            }
            h.unstate(settings.cookie);
        } catch (error) {
            console.log(error);
        }
    }

    async ttl(msecs) {

        const { h, request, settings } = this;
        const session = request.auth.artifacts;
        Hoek.assert(session, 'No active session to modify ttl on');
        request[settings.requestDecoratorName].h.state(settings.cookie, (session), { ttl: msecs });
        h.state(settings.cookie, session, { ttl: msecs });
    }
};

internals.implementation = (server, options) => {
    const results = internals.schema.validate(options);
    Hoek.assert(!results.error, results.error);

    const settings = results.value;
    const client = Redis.createClient(settings.redis);

    const cookieOptions = {
        encoding: 'iron',
        password: settings.password,
        isSecure: settings.isSecure, // Defaults to true
        path: settings.path,
        isSameSite: settings.isSameSite,
        isHttpOnly: settings.isHttpOnly, // Defaults to true
        clearInvalid: settings.clearInvalid,
        ignoreErrors: true
    };

    if (settings.ttl) {
        cookieOptions.ttl = settings.ttl;
    }

    if (settings.domain) {
        cookieOptions.domain = settings.domain;
    }

    if (typeof settings.appendNext === 'boolean') {
        settings.appendNext = (settings.appendNext ? 'next' : '');
    }

    server.state(settings.cookie, cookieOptions);
    const decoration = (request) => {
        return new internals.CookieAuth(request, settings, client);
    };

    // Check if the request object should be decorated
    const isDecorated = server.decorations.request.indexOf(settings.requestDecoratorName) >= 0;

    if (!settings.ignoreIfDecorated || !isDecorated) {
        server.decorate('request', settings.requestDecoratorName, decoration, { apply: true });
    }

    server.ext('onPreAuth', (request, h) => {

        // Used for setting and unsetting state, not for replying to request
        request[settings.requestDecoratorName].h = h;

        return h.continue;
    });

    const scheme = {
        authenticate: async (request, h) => {
            const unauthenticated = (err, result) => {

                let redirectTo = settings.redirectTo;

                let uri = (typeof redirectTo === 'function') ? redirectTo(request) : redirectTo;
                if (!uri || request.auth.mode !== 'required') {
                    return h.unauthenticated(err);
                }

                if (settings.appendNext) {
                    if (uri.indexOf('?') !== -1) {
                        uri += '&';
                    } else {
                        uri += '?';
                    }

                    uri += `${settings.appendNext}=${encodeURIComponent(request.url.path)}`;
                }

                return h.response('You are being redirected.......').takeover().redirect(uri);
            };
            const validate = async () => {
                // Check cookie
                const session = request.state[settings.cookie];
                if (!session) {
                    return unauthenticated(Boom.unauthorized(null, 'cookie'));
                }

                if (!settings.validateFunc) {
                    if (settings.keepAlive) {
                        h.state(settings.cookie, session);
                    }

                    return h.authenticated({ credentials: session, artifacts: session });
                }

                let credentials = session;

                try {
                    const result = await settings.validateFunc(request, session, client, settings.cookie);

                    Hoek.assert(typeof result === 'object', 'Invalid return from validateFunc');
                    Hoek.assert(Object.prototype.hasOwnProperty.call(result, 'valid'), 'validateFunc must have valid property in return');

                    if (!result.valid) {
                        throw Boom.unauthorized(null, 'cookie');
                    }

                    credentials = result.credentials || credentials;

                    if (settings.keepAlive) {
                        h.state(settings.cookie, session);
                    }

                    return h.authenticated({ credentials, artifacts: session });
                } catch (err) {

                    Bounce.rethrow(err, 'system');

                    if (settings.clearInvalid) {
                        h.unstate(settings.cookie);
                    }

                    const unauthorized = Boom.isBoom(err) && err.typeof === Boom.unauthorized ? err : Boom.unauthorized('Invalid cookie');
                    return unauthenticated(unauthorized, { credentials, artifacts: session });
                }
            };

            return await validate();
        }
    };

    return scheme;
};
