const path = require('path');
//use mysql2 because it comes with prepared statements and promises wrapper(?) = https://github.com/sidorares/node-mysql2#using-prepared-statements
const mysql = require('mysql2');

//import config (for db, google API)
const config = require('./config/config.js');

//import mysql functions
const {
    initTable,
    resetTable,
    insertToTable
    } = require('./mysql/mysql.js');

//import google API and google sheets functions
const {
    googleAPI, 
    googleSheets
    } = require('./googleSheets/googleSheets.js');

//sanity check
console.log(`Current working directory of node = ${__dirname}`);

//use .env file
require('dotenv').config({path: `${__dirname}/../.env`});

//execute the whole logic as anonymous async function that runs as soon as node server.js
(async () => {
    //create connection to mysql database
        //using connection instead of pool, because this will be single thread and queries are simple
        //https://stackoverflow.com/questions/9736188/mysql-persistent-connection-vs-connection-pooling
        //https://dev.mysql.com/blog-archive/mysql-connection-handling-and-scaling/
        //https://devdotcode.com/connection-pooling-vs-single-connection/
    const dbConnection = mysql.createConnection(config.db);
    
    //initialize MYSQL init table if it does not already exists
    const dbTableName = process.env.DB_INIT_TABLE_NAME;
    initTable(dbConnection, dbTableName);

    //reset the init table
    resetTable(dbConnection, dbTableName);

    //auth to Google API
    const sheets = await googleAPI.authForSheets(config.googleAPI);
    
    //Google Sheets Query Object
    const sheetID = process.env.SHEET_ID;
    const sheetName = process.env.SHEET_NAME;
    const sheetRange = process.env.SHEET_TARGET_RANGE;
    const sheetsReadRequest = {
        spreadsheetId : sheetID,
        range: sheetName + '!' + sheetRange
    } 
    //send GET request to target Google Sheet
    const rows = await googleSheets.readTargetSheet(sheets, sheetsReadRequest);

    //print out received data
    if(rows.length){
        console.log('Data Received from Google Sheets API response = ');
        rows.map((rows) => {    
            console.log(`${rows}`);
        });
        //because there are data, insert received data to mysql database table 
        insertToTable(dbConnection, dbTableName, rows);
    }else{
        console.log('No data found on the target sheet.');
    }

})();