'use strict';

const mongoose = require('mongoose');
const config = require('../config/index');
const MongoDBUrl = config.mongoUri;

exports.plugin = {
    name: 'localMongo',
    version: '1.0.0',
    register: async function() {
        await mongoose.connect(MongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    }
};
