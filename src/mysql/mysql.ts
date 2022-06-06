
import mysql from 'mysql2/promise';

//generic reference for error handling of npm mysql
    //https://github.com/mysqljs/mysql#error-handling

//use .execute instead of .query to take advantage of automatic prepared statement (will cache the statements)
    //https://github.com/sidorares/node-mysql2/blob/master/documentation/Prepared-Statements.md
        //to close cache statement = connection.unprepare(<sql_query_with_?>); 
            //for manually controlling statements and queries
            //https://github.com/sidorares/node-mysql2/blob/master/documentation/Prepared-Statements.md#manual-prepare--execute

// mysql2 comes with prepared statements, which can protect from SQL injection attacks
    //http://stackoverflow.com/questions/8263371/how-can-prepared-statements-protect-from-sql-injection-attacks
    // https://github.com/sidorares/node-mysql2#using-prepared-statements
        // for more detail & syntax for manual prepare syntax 
        //https://github.com/sidorares/node-mysql2/blob/master/documentation/Prepared-Statements.md     

//with npm mysql2, comes with connection.execute helper
    // connection.query vs connection.execute 
                //https://stackoverflow.com/questions/53197922/difference-between-query-and-execute-in-mysql
                    // .query() = parameter substitution is handled on the client, can handle objects
                    // = .execute() = helper that combines statement prepare + query --> client prepare statement as serialized string and server handles the rest

//mysql explicit connection vs implicit connection
    // documentation = https://github.com/mysqljs/mysql#establishing-connections

//manual connection could give more granular control over connections,
    //BUT when combined with the need to also manually prepare (and optionally unprepare) statements for added protection against sql injection attacks,
    //taking advantage of helper function .execute() which comes with implicit connection and prepared statement deemed to be more valuable
        //the impact of lose of granular control over connections could be alleviated delegated to mysql itself by using connection pool instead of single connection
    //also the potential issue of order-sensitive queries being executed in parallel with multiple connections can be controlled through proper async/await & promise
    //BUT if it is required that a series of queries do NOT share connections or switch connection between queries,
        //it might be required to manually handle the connections again, as the .query() with implicit connection will automatically release the connection after each query

        //https://github.com/mysqljs/mysql#pooling-connections
        // --> mysql.createPool() -> pool.query() 
        // is shorthand for 
        // --> mysql.createPool() -> pool.getConnection() -> connection.query() -> connection.release() 
            //if want to close connection AND remove it, instead of just releasing = use connection.destroy() instead of connection.release()
        // closing all the connections in a pool = use .end()
            //https://github.com/mysqljs/mysql#closing-all-the-connections-in-a-pool


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