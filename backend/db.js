const {Pool} = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'LocumLah_DB',
    password: 'Password',
    port: 5432,
});

module.exports = pool;