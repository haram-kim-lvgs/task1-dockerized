//import relevant type definitions from types/types.ts
// import type {
//     GoogleApiConfig,
// } from '../types/types';

//import google API related packages
import {
    google,
    sheets_v4, //for type declaration
    // GaxiosResponse,
} from 'googleapis';
// const { resolve } = require('path');
//const { sheets } = require('googleapis/build/src/apis/sheets');

const googleAPI = {
    //auth to Google API and return obj with scope for Google Sheets API
    authForSheets: async (googleConfig: GoogleApiConfig) => {
        let sheets:sheets_v4.Sheets;
        try{
            // using service account with 'keyFile' property = https://www.npmjs.com/package/googleapis#service-account-credentials
            const authClient = await google.auth.getClient(googleConfig);
            sheets = google.sheets({ version: 'v4', auth: authClient });
            console.log('Authenticated to Google Sheets API using service account.');
        }catch(err){
            throw err;
        } 
        return sheets;
    },
}


const googleSheets = {
    readTargetSheet: async (sheets: sheets_v4.Sheets, sheetsReadRequest: sheets_v4.Params$Resource$Spreadsheets$Values$Get) => {
        let result; //LATER - need to figure out type notation from dependency npm: GaxiosResponse<sheets_v4.Schema$ValueRange>
        try{
            result = await sheets.spreadsheets.values.get(sheetsReadRequest);
        }catch(err){
            throw err;
        }
        return result.data.values;
    },
}

export {googleAPI, googleSheets};