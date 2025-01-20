import { Sequelize } from 'sequelize';
import { SequelizeDBconfig } from './types';

class DatabaseConnector {
    private dbConfig: SequelizeDBconfig;
    private sequelize: Sequelize | null = null;

    constructor(dbConfig: SequelizeDBconfig) {
        this.dbConfig = dbConfig;
        this.validateConfig();
        this.sequelize = this.createConnection();
    }

    private validateConfig(): void {
        const { dbDialect, dbHost, dbName, dbUser, dbPassword, mssqlDialectOptions, oracleDialectOptions, snowflakeAccount, snowflakeSchema, snowflakeWarehouse } = this.dbConfig;
        if (!dbDialect || !dbName || !dbUser || !dbPassword) {
            throw new Error('Missing required database configuration values');
        }

        switch (dbDialect) {
            case 'mssql':
                if (!mssqlDialectOptions || !mssqlDialectOptions.options || !mssqlDialectOptions.options.encrypt || !mssqlDialectOptions.options.trustServerCertificate) {
                    throw new Error('Missing required MSSQL dialect options');
                }
                break;
            case 'oracle':
                if (!oracleDialectOptions || !oracleDialectOptions.connectString) {
                    throw new Error('Missing required Oracle dialect options');
                }
                break;
            case 'snowflake':
                if (!snowflakeAccount || !snowflakeSchema || !snowflakeWarehouse) {
                    throw new Error('Missing required Snowflake configuration values');
                }
                break;

            default:
                if (!dbHost) {
                    throw new Error('Missing required database host');
                }
                break;
        }
    }

    private constructConfig(): any {
        const { dbDialect, dbHost, dbPort, dbLogging, pool, mssqlDialectOptions, oracleDialectOptions, snowflakeAccount, snowflakeSchema, snowflakeWarehouse } = this.dbConfig;

        let options: any = {
            host: dbHost,
            port: dbPort ? Number(dbPort) : 3306,
            dialect: dbDialect as any, // Type assertion for dynamic dialects
            logging: dbLogging || false,
        };

        if (pool) {
            options.pool = {
                max: pool.max || 5,
                min: pool.min || 0,
                idle: pool.idle || 10000,
                acquire: pool.acquire || 10000,
            };
        }

        switch (dbDialect) {
            case 'mssql':
                options.dialectOptions = {
                    options: {
                        encrypt: mssqlDialectOptions?.options?.encrypt || false,
                        trustServerCertificate: mssqlDialectOptions?.options?.trustServerCertificate || false,
                    },
                };
                break;
            case 'oracle':
                options.dialectOptions = {
                    connectString: oracleDialectOptions?.connectString,
                };
                break;
            case 'snowflake':
                delete options.host;
                options = {
                    ...options,
                    account: snowflakeAccount,
                    warehouse: snowflakeWarehouse,
                    schema: snowflakeSchema,
                };
                break;
        }

        return options;
    }

    private createConnection(): Sequelize {
        let sequelize: Sequelize;
        const configuration = this.constructConfig();

        switch (this.dbConfig.dbDialect) {
            case 'snowflake':
                sequelize = new Sequelize(configuration);
                break;
            default:
                const { dbName, dbUser, dbPassword } = this.dbConfig;
                sequelize = new Sequelize(dbName, dbUser, dbPassword, {
                    ...configuration,
                });
                break;
        }
        return sequelize;
    }

    public getSequelizeInstance(): Sequelize {
        if (!this.sequelize) {
            this.sequelize = this.createConnection();
        }
        return this.sequelize;
    }
}

export default DatabaseConnector;
