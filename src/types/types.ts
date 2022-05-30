//holds type definition

//config --> explicitly defining to not having to access property through bracket, but through dot notation
    // https://stackoverflow.com/questions/38324949/error-ts2339-property-x-does-not-exist-on-type-y?rq=1
/*export*/ type Config = {
    db: MysqlConfig,
    googleApi: GoogleApiConfig,
}

//mysql db config
/*export*/ type MysqlConfig = {
    host: string,
    port: string,
    database: string,
    user: string,
    password: string,
    protocol?:string,
}

//google api config
/*export*/ type GoogleApiConfig = {
    keyFile: string,
    scopes: string[]
}

// export type {Config};