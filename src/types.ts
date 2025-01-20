import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';

export type ModelDefinition = (sequelize: Sequelize, dataTypes: typeof DataTypes) => ModelStatic<Model>;

export interface SequelizeConnectorOptions {
    dbConfig: SequelizeDBconfig;
    modelsPath: string;
}

export interface SequelizeDBconfig {
    dbDialect: 'mysql' | 'postgres' | 'mariadb' | 'mssql' | 'db2' | 'oracle' | 'snowflake';
    dbHost?: string;
    dbPort?: number;
    dbName: string;
    dbUser: string;
    dbPassword: string;
    dbLogging?: boolean;
    pool?: SequelizePoolConfig;
    snowflakeAccount?: string; // Snowflake only - Account name (e.g. 'your_account') -- key account
    snowflakeWarehouse?: string; // Snowflake only - Warehouse name (e.g. 'your_warehouse') -- key warehouse
    snowflakeSchema?: string; // Snowflake only - Schema name (e.g. 'your_schema') -- key schema
    mssqlDialectOptions?: MSSQLDialectOptions;
    oracleDialectOptions?: OracleDialectOptions;
}

export interface MSSQLDialectOptions {
    options: {
        encrypt: boolean; // Enable encryption for secure connections
        trustServerCertificate: boolean; // Allow self-signed certificates
    };
}

export interface OracleDialectOptions {
    connectString: string; // Oracle only - Oracle connect string
}

export interface SequelizePoolConfig {
    max?: number; // Maximum number of connections in the pool
    min?: number; // Minimum number of connections in the pool
    idle?: number; // The maximum time, in milliseconds, that a connection can be idle before being released
    acquire?: number; // The maximum time, in milliseconds, that pool will try to get connection before throwing error
}
