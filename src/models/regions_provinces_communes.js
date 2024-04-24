'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const regions_provinces_communesModel = new Schema({
    region: { type: String, required: true },
    region_number: { type: String, required: true },
    region_iso_3166_2: { type: String, required: true },
    provincias: [
        {
            name: { type: String, required: true },
            comunas: [
                {
                    name: { type: String, required: true },
                    code: { type: String, required: true }
                }
            ]
        }
    ]
});

module.exports = mongoose.model('Regions_Provinces_Communes', regions_provinces_communesModel, 'regions_provinces_communes');
