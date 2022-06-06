//import relevant type definitions from types/types.ts
import type { SheetsReadRequest } from './types/types';
import type { sheets_v4 } from 'googleapis';

//use mysql2 because it comes with prepared statements and promises wrapper 
import mysql from 'mysql2/promise';

//import config (for db, google API)
// import * as config from './config/config'; //--> this imports everything from config & wrap them under object named config
// import config from './config/config'; //--> in the back this is simply a shorthand for above line... which imports only the default
import {config} from './config/config'; //--> this is named import

//import mysql functions
import {
    initTable,
    resetTable,
    insertToTable,
    } from './mysql/mysql';

//import google API and google sheets functions
import {
    googleAPI, 
    googleSheets
    } from './googleSheets/googleSheets';

//sanity check
console.log(`Current working directory of node = ${__dirname}`);
console.log(`credential directory = ${config.googleApi.keyFile}`);

//use .env file
import dotenv from 'dotenv';
dotenv.config({path: `${__dirname}/../.env`});

//execute the whole logic as anonymous async function that runs as soon as node server.js starts
(async () => {
    //create connection to mysql database
        //decided to use connection pool instead of single connection for potential scalability
            //https://dev.mysql.com/blog-archive/mysql-connection-handling-and-scaling/
            //https://stackoverflow.com/questions/20712417/why-are-database-connection-pools-better-than-a-single-connection
            //https://devdotcode.com/connection-pooling-vs-single-connection/
        //biggest reason = decreasing the overhead of creating and removing connections for every query, which can impact performance of the application when it scales
            //using promise wrapper of mysql2 = https://github.com/sidorares/node-mysql2/blob/master/documentation/Promise-Wrapper.md#es7-async-await
    const dbConnectionPool: mysql.Pool = mysql.createPool(config.db); 
    
    //initialize MYSQL init table if it does not already exists
        //nullish coalescing operator = https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
    const dbTableName = process.env.DB_INIT_TABLE_NAME ?? 'default_table_name';
    const maxRetry = Number(process.env.DB_INIT_RETRY);
    const retryInterval = Number(process.env.DB_INIT_RETRY_INTERVAL);
    
    let result: Array<mysql.ResultSetHeader> | undefined = await initTable(dbConnectionPool, dbTableName, maxRetry, retryInterval);    
        if(!result){          
            //(can comment out below for testing = ) if comment out below, node will not crash at error 
            throw new Error(`CRASHING APP because FAILED TO INIT TABLE within ${maxRetry} attempts, defined by env DB_INIT_RETRY`);
        }

    //reset initiated table if set to reset in .env file 
    if(Boolean(process.env.DB_RESET_TABLE_AT_INIT)){
        const maxRetry = Number(process.env.DB_RESET_RETRY);
        const retryInterval = Number(process.env.DB_RESET_RETRY);
        let result: Array<mysql.ResultSetHeader> | undefined = await resetTable(dbConnectionPool, dbTableName, maxRetry, retryInterval);

        if(!result){
            //(can comment out below for testing = ) if comment out below, node will not crash at error 
            throw new Error(`CRASHING APP because FAILED TO RESET INITIALIZED TABLE within ${maxRetry} attempts, defined by env DB_RESET_RETRY`);
        }
    }else{
        console.log('SKIPPED table reset based on env var DB_RESET_TABLE_AT_INIT')
    }

    //auth to Google API
    const sheets: sheets_v4.Sheets = await googleAPI.authForSheets(config.googleApi);
    
    //Google Sheets Query Object
    const sheetID = process.env.SHEET_ID ?? 'default sheet id';
    const sheetName = process.env.SHEET_NAME ?? 'sheet1'; //default sheet name
    const sheetRange = process.env.SHEET_TARGET_RANGE ?? 'A:Z'; //default range 
    const sheetsReadRequest: SheetsReadRequest = {
        spreadsheetId : sheetID,
        range: sheetName + '!' + sheetRange
    } 

    //send GET request to target Google Sheet
    const rows = await googleSheets.readTargetSheet(sheets, sheetsReadRequest);

    //print out received data
        //implement narrowing for rows (typeof or type guard, etc)
        //Truthiness narrowing = https://www.typescriptlang.org/docs/handbook/2/narrowing.html#truthiness-narrowing
    if(rows){
        if(rows.length) {
            console.log('Data Received from Google Sheets API response = ');
            rows.map((rows) => {    
                console.log(`${rows}`);
            });
            
            //because there are data, insert received data to mysql database table 
            const maxRetry = Number(process.env.DB_INSERT_RETRY);
            const retryInterval = Number(process.env.DB_INSERT_RETRY_INTERVAL);

            let result: Array<mysql.ResultSetHeader> | undefined = await insertToTable(dbConnectionPool, dbTableName, rows, maxRetry, retryInterval);
            if(!result){
                //(can comment out below for testing = ) if comment out below, node will not crash at error 
                throw new Error(`CRASHING APP because FAILED TO INSERT VALUES within ${maxRetry} attempts, defined by env DB_INSERT_RETRY`);
            }
        }else{
            console.log('There was no data found on the target sheet.');
        }
    }else{
        console.log('There was issue with getting data from the target sheet.');
    }
})();