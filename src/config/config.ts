//import relevant type definitions from types/types.ts
// import type {
//     Config,
//     MysqlConfig,
//     GoogleApiConfig,
// } from '../types/types';

import path from 'path';

//use .env file
import dotenv from 'dotenv';
dotenv.config({path: `${__dirname}/../../.env`});

//config object
const env = process.env;
const config = <Config> {
    //db config
    db : <MysqlConfig> {
        //for host, use db name defined in docker-compose.yml
        host    : env.DB_HOST ?? 'localhost',
        port    : env.DB_PORT ?? '3306',
        database: env.DB_NAME ?? 'default_database',
        user    : env.DB_USER ?? 'root',
        password: env.DB_PASSWORD ?? 'password',
        // protocol: 'tcp',
        },
    //google API config
    googleApi : <GoogleApiConfig> {
        keyFile: path.resolve(`${__dirname}/../../${process.env.GOOGLE_SECRET_PATH}`),
        scopes: [process.env.GOOGLE_API_SCOPE as string]
    },
    }

//export mysql db config
export {config}; //exporting this way, in ES Module syntax, the object is being exported with its values and related types intact
// export default {config}; //exporting this way, in ES Module, the export can be imported with default import, which only carries value, and not related types (and TS wont let you use dot notation to access properties, but only bracket notation)