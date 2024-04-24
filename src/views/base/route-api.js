const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);

const queryBuilder = require('../../database/queryBuilder');
const db = require('../../database/db');

module.exports = [{
    method: 'GET',
    path: '/api/%table%/',
    options: {
        handler: async (request, h) => {
            try {
                const { rows } = await db.query('%sql-table%');
                return rows;
            } catch (error) {
                process.env.NODE_ENV === 'dev' ? console.log(error) : false;
                return [];
            }
        }
    }
}, {
    method: 'GET',
    path: '/api/%table%/datatables/{param*}',
    options: {
        validate: {
            query: Joi.object().keys({
                _: Joi.number().min(0)
            })
        },
        handler: async (request, h) => {
            try {
                const { rows } = await db.query('SELECT * FROM %table%');
                return rows;
            } catch (error) {
                process.env.NODE_ENV === 'dev' ? console.log(error) : false;
                return [];
            }
        }
    }
}, {
    method: 'POST',
    path: '/api/%table%/many',
    handler: async (request, h) => {
        try {
            const { filter } = request.payload;
            const { where, values } = queryBuilder.selectMany(filter);
            const sql = `SELECT * FROM %table% WHERE ${where}`;
            const { rows } = await db.query(sql, values);
            return rows;
        } catch (error) {
            process.env.NODE_ENV === 'dev' ? console.log(error) : false;
            return [];
        }
    }
}, {
    method: 'POST',
    path: '/api/%table%/',
    options: {
        validate: {
            payload: Joi.object().keys({
                '%joi-data%'
            })
        },
        handler: async (request, h) => {
            try {
                '%const%'
                const sql = 'INSERT INTO %table% (%columns-db%) VALUES (%wilcards%) RETURNING *';
                const { rows } = await db.query(sql, ['%values%']);
                if (rows instanceof Array && rows.length > 0) {
                    return rows[0];
                }
                return [];
            } catch (error) {
                process.env.NODE_ENV === 'dev' ? console.log(error) : false;
                return [];
            }
        }
    }
}, {
    method: 'PATCH',
    path: '/api/%table%/many',
    options: {
        validate: {
            payload: Joi.object().keys({
                filter: Joi.array().required(),
                pk: Joi.number().required()
            })
        },
        handler: async (request, h) => {
            try {
                const { updateSql, values } = queryBuilder.updateMany(request.payload);
                const sql = `UPDATE %table% SET ${updateSql}`;
                await db.query(sql, values);
                return { updated: true };
            } catch (error) {
                process.env.NODE_ENV === 'dev' ? console.log(error) : false;
                return [];
            }
        }
    }
}, {
    method: 'DELETE',
    path: '/api/%table%/',
    options: {
        validate: {
            payload: Joi.object().keys({
                pk: Joi.number().required()
            })
        },
        handler: async (request, h) => {
            try {
                const { pk } = request.payload;
                const sql = 'DELETE FROM %table% WHERE pk=$1';
                await db.query(sql, [pk]);
                return { deleted: true };
            } catch (error) {
                process.env.NODE_ENV === 'dev' ? console.log(error) : false;
                return [];
            }
        }
    }
}];
