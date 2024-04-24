'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionsModel = new Schema({
    buy_order: { type: String },
    plans_id: { type: String },
    session_id: { type: String },
    amount: { type: Number },
    token: { type: String },
    vci: { type: String },
    status: { type: String },
    card_detail: [{ type: Object }],
    accounting_date: { type: String },
    transaction_date:  { type: String },
    authorization_code: { type: String },
    payment_type_code: { type: String },
    response_code: { type: String },
    installments_amount: { type: Number },
    installments_number: { type: Number },
    balance: { type: Number }
});

module.exports = mongoose.model('Subscriptions', subscriptionsModel, 'subscriptions');