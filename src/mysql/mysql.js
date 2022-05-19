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




// //init MYSQL table
// module.exports.initTable = async (dbConnection, dbTableName) => {
//     // MYSQL init query
//     const dbTableInitSqlQuery = `CREATE TABLE IF NOT EXISTS ${dbTableName} (id int NOT NULL AUTO_INCREMENT, cell VARCHAR(50), data TEXT, PRIMARY KEY(id))`
//     try{
//         await dbConnection.execute(dbTableInitSqlQuery);
//         console.log(`Database init table INITIATED!`);
//     }catch(err){
//         throw err;
//     }
    
// }

// //reset MYSQL table
// module.exports.resetTable = async (dbConnection, dbTableName) => {
//     let result;
//     // MYSQL table reset query
//     const dbTableResetSqlQuery = `DELETE FROM ${dbTableName}`;
//     try{
//         result = await dbConnection.execute(dbTableResetSqlQuery);
//         console.log(`Number of records deleted: ${result.affectedRows}`);
//     }catch(err){
//         throw err;
//     }
// }

// //insert rows to MYSQL table
// module.exports.insertToTable = async (dbConnection, dbTableName, rows) => {   
//     let result;   
//     //MYSQL insert to table query
//     const dbInsertToTableQuery = `INSERT INTO ${dbTableName} (cell, data) VALUES ?`;
//     // try{
//     //     result = await dbConnection.query(dbInsertToTableQuery, [rows]);
//     //     console.log(`insertToTable's result obj = ${JSON.stringify(result)}`);
//     // }catch(err){
//     //     dbConnection.end();
//     //     throw err; 
//     // }
//     console.log('about to call query -->');
//     // try{
//     dbConnection.query(dbInsertToTableQuery, [rows]); 
//     // dbConnection.query(dbInsertToTableQuery, [rows], 
//     //     (err, results/*, fields*/) => {
//     //         // if(err){
//     //         //     dbConnection.end()
//     //         //     throw err;
//     //         // }
//     //         // console.log(`results of insertToTable = ${JSON.stringify(results)}`)
//     //         console.log(`results of insertToTable = ${results}`)
//     //         // console.log(`fields of insertToTable = ${JSON.stringify(fields)}`)
//     //     });
//     // }catch(err){
//     //     console.log(err);
//     // }
// }