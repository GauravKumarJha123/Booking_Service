const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

console.log(__dirname);

console.log('Database Host:', process.env.DB_HOST);
console.log('Database Port:', process.env.DEV_PORT);
console.log('Server PORT', process.env.PORT);



module.exports = {
    username: process.env.DEV_USERNAME,
    password: process.env.DEV_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dev_port: process.env.DEV_PORT,
    port : process.env.PORT,
    flightServiceUrl: process.env.FLIGHT_SERVICE_URL,
    service: process.env.EMAIL_SERVICE,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    dialect: 'mysql',
};
