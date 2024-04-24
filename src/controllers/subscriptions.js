const short = require('short-uuid');
const Subscriptions = require('../models/subscriptions');

exports.list = async (request, h) => {
    try {
        const subscriptions = await Subscriptions.find({ active: true }).lean();
        return subscriptions;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.find = async (request, h) => {
    let user = request.user ? request.user : request.query.user;
    try {
        const subscriptions = await Subscriptions.find({ session_id: user }).lean();
        return subscriptions;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.get = async (request, h) => {
    try {
        const subscriptions = await Subscriptions.findById(request.params.id).exec();
        if (!subscriptions) { return { message: 'Registro no encontrado' }; }
        return subscriptions;
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.create = async (request, h) => {
    try {
        const subscriptionsData = {
            buy_order: short.generate(),
            plans_id: request.payload.plans_id,
            session_id: request.payload.session_id,
            amount: request.payload.amount
        };
        const subscriptions = await Subscriptions.create(subscriptionsData);
        return { message: 'Registro creado con exito', subscriptions };
    } catch (error) {
        console.log(error);
        return [];
    }
};

exports.update = async (request, h) => {
    try {
        const subscriptions = await Subscriptions.find({ buy_order : request.payload.buy_order }).exec();
        if (!subscriptions) { return { err: 'Registro no encontrado' }; }

        subscriptions.vci = request.payload.vci || subscriptions.vci;
        subscriptions.token = request.payload.token || subscriptions.token;
        subscriptions.status = request.payload.status || subscriptions.status;
        subscriptions.card_detail = request.payload.card_detail || subscriptions.card_detail;
        subscriptions.accounting_date = request.payload.accounting_date || subscriptions.accounting_date;
        subscriptions.transaction_date = request.payload.transaction_date || subscriptions.transaction_date;
        subscriptions.authorization_code = request.payload.authorization_code || subscriptions.authorization_code;
        subscriptions.payment_type_code = request.payload.payment_type_code || subscriptions.payment_type_code;
        subscriptions.response_code = request.payload.response_code || subscriptions.response_code;
        subscriptions.installments_amount = request.payload.installments_amount || subscriptions.installments_amount;
        subscriptions.installments_number = request.payload.installments_number || subscriptions.installments_number;
        subscriptions.balance = request.payload.balance || subscriptions.balance;

        await subscriptions.save();
        return { message: 'Registro actualizado con exito!' };
    } catch (error) {
        console.log(error);
        return [];
    }
};
exports.remove = async (request, h) => {
    try {
        const subscriptions = await Subscriptions.findById(request.params.id).exec();
        if (!subscriptions) { return { err: 'Registro no encontrado' }; }

        subscriptions.active = request.payload.active;

        await subscriptions.save(subscriptions);
        return { message: 'Registro desactivado con exito!' };
    } catch (error) {
        console.log(error);
        return [];
    }
};