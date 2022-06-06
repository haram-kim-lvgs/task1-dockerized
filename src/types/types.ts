//holds type definition
    //prefer interface when possible, over type 
        //https://google.github.io/styleguide/tsguide.html#interfaces-vs-type-aliases
        //https://ncjamieson.com/prefer-interfaces/
        //https://github.com/microsoft/TypeScript/wiki/Performance#preferring-interfaces-over-intersections

//config --> explicitly defining to not having to access property through bracket notation, but through dot notation
    //https://stackoverflow.com/questions/38324949/error-ts2339-property-x-does-not-exist-on-type-y?rq=1
// type Config = {
interface Config {
    db: MysqlConfig,
    googleApi: GoogleApiConfig,
}

//mysql db config
// type MysqlConfig = {
    //subset of mysql.PoolOptions = https://github.com/mysqljs/mysql#pool-options
    //which is superset of ConnectionOptions = https://github.com/mysqljs/mysql#connection-options
interface MysqlConfig {
    host: string,
    port: number,
    database: string,
    user: string,
    password: string,
    //connectionLimit: number, //number of connections to create at once 
    // waitForConnections: boolean,   //default = true
    //                                 //with both waitForConnection as true & queueLimit, the current error might NOT occur, if given sufficient timeout duration..?
    //                                 //BUT should rather implement .connect() retry wih setTimeout(), because too long of timeout is not good in prod env
    // queueLimit: number,
    // connectTimeout: , //default 10000 = 10sec 
    // acquireTimeout: , //default 10000 = 10sec
    // protocol?:string,
}

//google api config
// type GoogleApiConfig = {
interface GoogleApiConfig {
    keyFile: string,
    scopes: string[]
}

//google sheets api for reading range
// type SheetsReadRequest = {
interface SheetsReadRequest {
    spreadsheetId: string,
    range: string
}

//use as module (have top level import or export in the file, even if 'export {};') to prevent 'global pollution' e.g., avoiding duplicate identifier
//also use named export/import && avoid using 'as' keyword when importing for maintainability & future-proofing
    //https://stackoverflow.com/questions/46913851/why-and-when-to-use-default-export-over-named-exports-in-es6-modules
    //https://engineering.linecorp.com/ja/blog/you-dont-need-default-export/
export type {Config, MysqlConfig, GoogleApiConfig, SheetsReadRequest}; 