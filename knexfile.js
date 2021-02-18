require('dotenv').config();
const pg = require('pg');

pg.defaults.ssl = {
	rejectUnauthorized: false,
 }

module.exports = {
	development: {
		client: 'pg',
        // eslint-disable-next-line no-undef
        connection: process.env.DATABASE_URL,
        ssl: {
              rejectUnauthorized: false
        },
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			directory: './data/migrations'
		},
		seeds: { directory: './data/seeds' },
		afterCreate: (conn, done) => {
			// runs after a connection is made to the sqlite engine
			conn.run('PRAGMA foreign_keys = ON', done); // turn on FK enforcement
		},
		useNullAsDefault: true
	},
	production: {
		client: 'pg',
        // eslint-disable-next-line no-undef
        connection: process.env.PROD_DATABASE_URL,
        ssl: {
              rejectUnauthorized: false
        },
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			directory: './data/migrations'
		},
		useNullAsDefault: true
	},
	
};

