const fetch = require('node-fetch');
const Uuid = require('uuid');

const config = require('../config');
const jwt = require('../helpers/jwt');

module.exports = async function(pk, request) {
    try {
        /* GET USER DATA FROM USERNAME */
        let body = await fetch(`${config.localUrl}/api/login/userByPk`, { method: 'POST', body: JSON.stringify({ pk }) });
        let account = await body.json();
        account = account[0];
        delete account.password;
        const sid = Uuid.v4();

        /* LOAD USERS SPECIALTY */
        response = await fetch(`${config.localUrl}/api/users-speciality/many`, {
            method: 'POST',
            body: JSON.stringify({ filter: [{ column: 'users_fk', value: account.pk }] }),
            headers: { 'Content-Type': 'application/json' }
        });
        let usersSpecialty = await response.json();
        for (let index = 0; index < usersSpecialty.length; index++) {
            const item = usersSpecialty[index];
            let token = await jwt.sign(item);
            usersSpecialty[index].token = token;
        }
        account.userSpecialty = usersSpecialty;

        account.scope = [];
        if (account.superadmin) {
            account.scope.push('SUPERADMIN');
        }

        if (account.roles.length === 1) { // SI solo posee un Rol lo deja pasar por Defecto
            account.manyRoles = false;
            account.usersRolePk = account.roles[0].usersRolePk;
            account.roleName = account.roles[0].roleName;
            account.rolePk = account.roles[0].rolePk;
            account.zoomReport = account.rolePk === 7 ? 110 : 110;
            delete account.roles;

            await request.cookieAuth.set(account);
            return { error: false, account };
        }
        account.manyRoles = true;
        account.publicUrl = config.publicUrl;

        /* CADA INICIO DE SESIóN ES INDEPENDIENTE, AUNQUE SEAN EL MISMO USUARIO */
        account.uid = sid;
        account.key = sid;
        /* CADA INICIO DE SESIóN ES INDEPENDIENTE, AUNQUE SEAN EL MISMO USUARIO */

        // Si posee MAS de un Rol lo lleva a la pantalla de selección de rol para ingresar
        await request.cookieAuth.set(account);

        return { error: false, account };
    } catch (error) {
        process.env.NODE_ENV === 'dev' && console.log({ error });
        return { error: true };
    }
};
