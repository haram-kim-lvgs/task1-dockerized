
import mysql from 'mysql2/promise';


//init MYSQL table
export async function initTable (dbConnection: mysql.Pool, dbTableName: string, retry: number = 0, interval: number = 5000):Promise<any> {
    //consulted below link for query to initiate a table 
        //https://livecodestream.dev/post/your-guide-to-building-a-nodejs-typescript-rest-api-with-mysql/
    const dbTableInitSqlQuery = `CREATE TABLE IF NOT EXISTS ${dbTableName} (id int NOT NULL AUTO_INCREMENT, cell TEXT, data TEXT, PRIMARY KEY(id))`
    for(let i = 0; i < retry+1; i++){
        try{
            // await dbConnection.execute(dbTableInitSqlQuery); 
            let result = await dbConnection.execute(dbTableInitSqlQuery); 
            if(result){
                console.log(`Initialized Database table = ${dbTableName}`);
                return result;
            }
        }catch(err){
            console.error(err);
                // promise only allows the usage of the output at some later time, unlike callbacks, which require the results to be used immediately
            await new Promise((resolve)=>{
                //code here runs immediately
                //resolve this promise after waiting 5 sec (or value of interval in ms)
                setTimeout(()=>{resolve('waited')}, interval);
            });        
        }
    }
}


//reset MYSQL table
export async function resetTable (dbConnection: mysql.Pool, dbTableName: string, retry: number = 0, interval: number = 5000): Promise<any> {
    const dbTableResetSqlQuery = `DELETE FROM ${dbTableName}`;
    for(let i = 0; i < retry +1; i++){
        try{

            let result = await dbConnection.execute(dbTableResetSqlQuery);
            if(result){
                console.log(`Resetted initialized table = ${dbTableName}`);
                //@ts-ignore
                console.log(`Number of rows deleted: ${result[0].affectedRows}`);
                return result;
            }
        }catch(err){ 
            console.log('Failed to reset initialized table');
            console.log(`error = ${err.message}`);
            console.log(err);
            await new Promise((resolve)=>{
                setTimeout(()=>{resolve('waited')}, interval);
            });
        } 
    }
}

// //insert rows to MYSQL table
export async function insertToTable (dbConnection: mysql.Pool, dbTableName: string, rows: any[][], retry: number = 0, interval: number = 5000): Promise<any> {   
    const dbInsertToTableQuery = `INSERT INTO ${dbTableName} (cell, data) VALUES ?`;
    // currently unable to bulk insert with .execute = known issue
        // -issue = https://github.com/sidorares/node-mysql2/issues/830
        // solution = send bulk as json string

    //work around to use connection.execute() helper in npm mysql2 with bulk insert
        //mysql.format() =
                //https://github.com/mysqljs/mysql#escaping-query-values
                //https://github.com/mysqljs/mysql#preparing-queries
    let preparedSqlString = mysql.format(dbInsertToTableQuery, [rows]);
    console.log(`Prepared SQL string = ${preparedSqlString}`);
    for(let i = 0; i < retry+1; i++){
        try{
            let result = await dbConnection.execute(preparedSqlString);
            if(result){
                console.log('Inserted received data from Google Sheets to database table');
                //@ts-ignore
                console.log(`Number of rows inserted = ${result[0].affectedRows}`);
                //@ts-ignore
                console.log(`Inserted result = ResultSetHeader info = ${result[0].info}`)
                    //skipping pool.release(conn) because .execute() is a shorthand for .prepare() + .query() and .query() is a shorthand for .getConnection + .query() + .release() 
                    //will not pool.end(); because we are not planning on closing down and removing all of the connections here
                return result;
            }
        }catch(err){
            console.log('Failed to insert data from Google Sheets to database table');
            console.log(`error = ${err.message}`);
            console.log(err);
            await new Promise((resolve)=>{
                setTimeout(()=>{resolve('waited')}, interval);
            })
        }; 
    }
}