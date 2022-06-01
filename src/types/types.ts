//holds type definition
    //prefer interface when possible, over type 
    // https://ncjamieson.com/prefer-interfaces/
    // https://github.com/microsoft/TypeScript/wiki/Performance#preferring-interfaces-over-intersections

//config --> explicitly defining to not having to access property through bracket, but through dot notation
    // https://stackoverflow.com/questions/38324949/error-ts2339-property-x-does-not-exist-on-type-y?rq=1
// type Config = {
interface Config {
    db: MysqlConfig,
    googleApi: GoogleApiConfig,
}

//mysql db config
// type MysqlConfig = {
interface MysqlConfig {
    host: string,
    port: string,
    database: string,
    user: string,
    password: string,
    protocol?:string,
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

//use as module to prevent 'global pollution' e.g., avoiding duplicate identifier
//also use named export/import && avoid using 'as' keyword when importing for maintainability & future-proofing
export type {Config, MysqlConfig, GoogleApiConfig, SheetsReadRequest}; 