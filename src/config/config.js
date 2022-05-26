const path = require('path');

//use .env file
require('dotenv').config({path: `${__dirname}/../../.env`});

//config object
const env = process.env;
const config = {
    //db config
    db : {
         //for host, use db name defined in docker-compose.yml
        host    : env.DB_HOST,
        database: env.DB_NAME,
        port    : env.DB_PORT,
        user    : env.DB_USER,
        password: env.DB_PASSWORD,
        },
    //google API config
    googleAPI : {
        keyFile: path.resolve(`${__dirname}/../../${process.env.GOOGLE_SECRET_PATH}`),
        scopes: [process.env.GOOGLE_API_SCOPE]
    },
    }

//export mysql db config
module.exports = config;