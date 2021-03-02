// -----------------------------
// developed by Nagharaco
// Naghshara Cunsolting Company
// Nodejs Website -> Managing published services
//------------------------------


const { Pool } = require('pg');
const dbConfig = require('../data/config').db;

class PGService {
	constructor() {
		this.host = dbConfig.host;
		this.port = dbConfig.port;
		this.user = dbConfig.user;
		this.password = dbConfig.password;
		this.database = dbConfig.database;
	}

	createPool() {
		return new Pool({
			host: this.host,
			port: this.port,
			user: this.user,
			password: this.password,
			database: this.database
		});
	};

	checkConnection = () => new Promise((resolve, reject) => {
		try {
			const pool = this.createPool();
			pool.query('SELECT NOW()', (err, res) => {
				if (res) {
					if (res.rows.length) {
						resolve('')
					} else {
						reject('')
					}
				} else {
					reject('')
				}
				pool.end()
			});
		} catch (error) {
			reject(error)
		}
	});

}

module.exports = PGService