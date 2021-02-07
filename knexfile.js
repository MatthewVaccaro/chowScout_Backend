require('dotenv').config();
const pg = require('pg');

// pg.defaults.ssl = true;

module.exports = {
	development: {
		client: 'pg',
		connection: {
			host: 'localhost',
			port: 5432,
			user: 'postgres',
			database: 'challengerDB',
			password: process.env.LOCAL_PASSWORD
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
		connection: process.env.DATABASE_URL,
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tablename: 'challenge_migrations',
			directory: './data/migrations'
		},
		seeds: { directory: './data/seeds' }
	}
};