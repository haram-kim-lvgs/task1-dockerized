//import google API related packages
const { google } = require ('googleapis');
// const { resolve } = require('path');
//const { sheets } = require('googleapis/build/src/apis/sheets');

const googleAPI = {
    //auth to Google API and return obj with scope for Google Sheets API
    authForSheets: async (googleConfig) => {
        let sheets;
        try{
            // const authClient = await google.auth.getClient(
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
    readTargetSheet: async (sheets, sheetsReadRequest) => {
        let result;
        try{
            result = await sheets.spreadsheets.values.get(sheetsReadRequest);
        }catch(err){
            throw err;
        }
        return result.data.values;
    },
}

module.exports = {googleAPI, googleSheets};