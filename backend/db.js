const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'LocumLah_DB',
    password: 'LocumLah_password',
    port: 5432,
});

module.exports = pool;
