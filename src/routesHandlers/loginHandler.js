const fetch = require('node-fetch');
const Bcrypt = require('bcryptjs');
const Uuid = require('uuid');

const config = require('../config');

module.exports = async (request, h) => {
    try {
        const { login, password } = request.payload;

        /* GET USER DATA FROM EMAIL */
        let body = await fetch(`${config.localUrl}/api/login/search_user`, {
            method: 'POST',
            body: JSON.stringify({ login }),
            headers: { 'Content-Type': 'application/json' }
        });
        let account = await body.json();

        let institution = account[0].institution[0];

        account[0].institution = institution;

        if (Array.isArray(account) && account.length <= 0) {
            return h.view('app/login', { error: 'Usuario no registrado en la Base de Datos' }, { layout: 'clean' });
        }
        account = account[0];
        account.auth = [];

        for (const permission of account.role.permissions) {
            let { module, type } = permission;
            account.auth.push({ module, type });
        }

        const isValid = Bcrypt.compareSync(password, account.password);

        if (!isValid) {
            return h.view('app/login', { error: 'ContraseÃ±a incorrecta.' }, { layout: 'clean' });
        }

        delete account.password;

        account.sid = Uuid.v4();
        account.domain = config.publicUrl;

        await request.cookieAuth.set(account);

        return h.redirect('/');

    } catch (error) {
        console.log({ error });
        return h.view('app/login', { error: 'Error interno de la aplicaciÃ³n. Contacte a su administrador.' }, { layout: 'clean' });
    }
};