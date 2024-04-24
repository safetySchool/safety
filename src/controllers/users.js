var User = require('../models/users');
const createHashPassword = require('../helpers/generatePassword');
const Boom = require('@hapi/boom');
const Bcrypt = require('bcryptjs');
const { sendMailCustom } = require('../helpers/sendMail');
const config = require('../config');

function findRole(array, module, type) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].module === module && array[i].type === type) {
            return array[i];
        }
    }
    return false;
}

exports.list = async (request, h) => {
    try {
        return await User.find().populate('role', { name: 1 })
            .populate('institution', { name: 1 }).exec();
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.listAdmin = async (request, h) => {
    try {
        let { auth } = request.auth.credentials;
        if (findRole(auth, 'USERS', 'VIEW_ALL')) {
            return await User.find({ password: { $ne: null } }).populate('role', ['name']).exec();
        }
        return [await User.findById(request.auth.credentials.id).exec()];
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.listPatient = async (request, h) => {
    try {
        return await User.find({ password: { $exists: false } }).populate('role', ['name']).exec();
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.get = async (request, h) => {
    try {
        const user = await User.findById(request.params.id).exec();
        if (!user) {
            return { message: 'Usuario no encontrado' };
        }
        return user;
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.getUserByToken = async (request, h) => {
    try {
        const token = request.params.token;
        const user = await User.findOne({ token: token }).exec();
        if (!user) {
            return false;
        }
        return user;
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.getInstitutionName = async (request, h) => {
    try {
        const user = await User.findById(request.params.id).populate('institution', ['name']).exec();
        if (!user) {
            return { message: 'Usuario no encontrado' };
        }
        return user;
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.create = async (request, h) => {
    try {
        let { login, name, lastname, role, institution, email } = request.payload;
        let { hash, password } = createHashPassword();
        await User.create({ login, name, lastname, role, institution, email, password: hash });
        return { password };
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};

exports.newPassword = async (request, h) => {
    try {
        let { hash, password } = createHashPassword();
        const user = await User.findById(request.payload.id).exec();
        if (!user) {
            return Boom.notFound('Usuario no encontrado');
        }
        user.password = hash;
        await user.save();
        return { message: 'Contraseña cambiada con éxito!', password };
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('Error cambiando la contraseña');
    }
};

exports.passwordVerify = async (request, h) => {
    try {
        let { password } = request.query;
        let { id: userId } = request.params;
        const user = await User.findById(userId).exec();
        if (!user) {
            return Boom.notFound('Usuario no encontrado');
        }
        const isMatch = Bcrypt.compareSync(password, user.password);
        return { isMatch };
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('Internal Error');
    }
};

exports.update = async (request, h) => {
    try {
        const user = await User.findById(request.payload._id).exec();
        if (!user) {
            return { err: true, message: 'Usuario no encontrado' };
        }
        user.role = request.payload.role || user.role;
        user.institution = request.payload.institution || user.institution;
        user.login = request.payload.login || user.login;
        user.name = request.payload.name || user.name;
        user.lastname = request.payload.lastname || user.lastname;
        user.email = request.payload.email || user.email;
        let passwordUpdate = null;
        if (request.payload.password) {
            let { hash } = createHashPassword(request.payload.password);
            passwordUpdate = hash;
        }
        user.password = passwordUpdate || user.password;
        user.active = 'active' in request.payload ? request.payload.active : user.active;
        user.token = 'token' in request.payload ? request.payload.token : user.token;
        await user.save();
        return { err: false, message: 'Registro actualizado con exito!' };
    } catch (error) {
        return Boom.badImplementation('internal error');
    }
};

exports.updateForgotPassword = async (request, h) => {
    try {
        const user = await User.findById(request.payload._id).exec();
        if (!user) {
            return { err: true, message: 'Usuario no encontrado' };
        }
        user.role = request.payload.role || user.role;
        user.institution = request.payload.institution || user.institution;
        user.login = request.payload.login || user.login;
        user.name = request.payload.name || user.name;
        user.lastname = request.payload.lastname || user.lastname;
        user.email = request.payload.email || user.email;
        user.password = request.payload.password || user.password;
        user.active = 'active' in request.payload ? request.payload.active : user.active;
        user.token = request.payload.token || user.token;
        await user.save();
        sendMailCustom(user.email, 'Cambio De Contraseña', { activity: user.login, actionUrl: `${config.publicUrl}/newPassword?p=${user.token}`, name: user.name }, 'forgotpassword', null).then();
        return { err: false, message: 'Registro actualizado con exito!' };
    } catch (error) {
        return Boom.badImplementation('internal error');
    }
};

exports.remove = async (request, h) => {
    try {
        const user = await User.findById(request.payload.id).exec();
        if (!user) {
            return { err: 'Usuario no encontrado' };
        }
        user.active = false;
        await user.save(user);
        return { message: 'Usuario desactivado con exito!' };
    } catch (error) {
        console.log(error);
        return Boom.badImplementation('internal error');
    }
};
