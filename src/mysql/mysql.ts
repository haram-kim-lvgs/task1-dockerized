//import mysql2 package
import type mysql from 'mysql2';

//init MYSQL table
export function initTable (dbConnection: mysql.Connection, dbTableName: string): void {
    const dbTableInitSqlQuery = `CREATE TABLE IF NOT EXISTS ${dbTableName} (id int NOT NULL AUTO_INCREMENT, cell VARCHAR(50), data TEXT, PRIMARY KEY(id))`
    
    dbConnection.execute(dbTableInitSqlQuery, (err) => {
        if (err) throw err;
        console.log(`Database initiated table = ${dbTableName}`);
    });
}

//reset MYSQL table
// export function resetTable (dbConnection: mysql.Connection, dbTableName: string): mysql.OkPacket|mysql.RowDataPacket{
export function resetTable (dbConnection: mysql.Connection, dbTableName: string): void {
    const dbTableResetSqlQuery = `DELETE FROM ${dbTableName}`;
    
    //https://livecodestream.dev/post/your-guide-to-building-a-nodejs-typescript-rest-api-with-mysql/
    dbConnection.execute(dbTableResetSqlQuery, (err, result: mysql.OkPacket) => {
        if (err) throw err;
        console.log(`Resetted database table = ${dbTableName}`);
        console.log(`Number of records deleted: ${result.affectedRows}`);
    });
}

//insert rows to MYSQL table
export function insertToTable (dbConnection: mysql.Connection, dbTableName: string, rows: any[][]): void {   
    const dbInsertToTableQuery = `INSERT INTO ${dbTableName} (cell, data) VALUES ?`;
    
    dbConnection.query(dbInsertToTableQuery, [rows], 
        (err) => {
            //close db connection
            dbConnection.end();
            if (err) throw err;
            console.log('Inserted received data from Google Sheets to database table');
        } ); 
}