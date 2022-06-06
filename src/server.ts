//import relevant type definitions from types/types.ts
import type { SheetsReadRequest } from './types/types';
import type { sheets_v4 } from 'googleapis';

//use mysql2 because it comes with prepared statements and promises wrapper 
import mysql from 'mysql2/promise';

//import config (for db, google API)
// import * as config from './config/config'; //--> this imports everything from config & wrap them under object named config
// import config from './config/config'; //--> in the back this is simply a shorthand for above line... which imports only the default
import {config} from './config/config';

//import mysql functions
import {
    initTable,
    resetTable,
    insertToTable
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

//execute the whole logic as anonymous async function that runs as soon as node server.js
(async () => {
    //create connection to mysql database
        //using connection instead of pool, because this will be single thread and queries are simple
        //https://stackoverflow.com/questions/9736188/mysql-persistent-connection-vs-connection-pooling
        //https://dev.mysql.com/blog-archive/mysql-connection-handling-and-scaling/
        //https://devdotcode.com/connection-pooling-vs-single-connection/
    // const dbConnection = mysql.createConnection(config['db']); //https://stackoverflow.com/questions/38324949/error-ts2339-property-x-does-not-exist-on-type-y?rq=1
    // @ts-ignore
    const dbConnection: mysql.Connection = mysql.createConnection(config.db); /*as unknown as string*/ //forcing TS to recog it as string
    
    //initialize MYSQL init table if it does not already exists
        //nullish coalescing operator = https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
    const dbTableName = process.env.DB_INIT_TABLE_NAME ?? 'default_table_name';
    initTable(dbConnection, dbTableName);

    //reset the init table
    resetTable(dbConnection, dbTableName);

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
            insertToTable(dbConnection, dbTableName, rows);
        }else{
            console.log('No data found on the target sheet.');
        }
    }else{
        console.log('Issue with getting data from the target sheet.');
    }
})();