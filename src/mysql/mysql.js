//init MYSQL table
module.exports.initTable = (dbConnection, dbTableName) => {
    const dbTableInitSqlQuery = `CREATE TABLE IF NOT EXISTS ${dbTableName} (id int NOT NULL AUTO_INCREMENT, cell VARCHAR(50), data TEXT, PRIMARY KEY(id))`
    
    dbConnection.execute(dbTableInitSqlQuery, (err) => {
        if (err) throw err;
        console.log(`Database initiated table = ${dbTableName}`);
    });
}

//reset MYSQL table
module.exports.resetTable = (dbConnection, dbTableName) => {
    const dbTableResetSqlQuery = `DELETE FROM ${dbTableName}`;
    
    dbConnection.execute(dbTableResetSqlQuery, (err, result) => {
        if (err) throw err;
        console.log(`Resetted database table = ${dbTableName}`);
        console.log(`Number of records deleted: ${result.affectedRows}`);
    });
}

//insert rows to MYSQL table
module.exports.insertToTable = (dbConnection, dbTableName, rows) => {   
    const dbInsertToTableQuery = `INSERT INTO ${dbTableName} (cell, data) VALUES ?`;
    
    dbConnection.query(dbInsertToTableQuery, [rows], 
        (err) => {
            //close db connection
            dbConnection.end();
            if (err) throw err;
            console.log('Inserted received data from Google Sheets to database table');
        } ); 
}