const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'sample',
    port: 3307,
    connectionLimit: 5
});



// Connect and check for errors
module.exports = Object.freeze({
    pool: pool
});

