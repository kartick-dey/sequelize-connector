import { Sequelize } from 'sequelize';
import { SequelizeConnectorOptions } from './types';
import ModelRegistrar from './modelRegistrar';
import DatabaseConnector from './database';

export class SequelizeConnector {
    private sequelize!: Sequelize;
    private models: Record<string, any> = {};

    constructor(private options: SequelizeConnectorOptions) {
        this.initialize();
    }

    private async initialize() {
        try {
            this.sequelize = new DatabaseConnector(this.options.dbConfig).getSequelizeInstance();
            this.models = new ModelRegistrar(this.sequelize, this.options.modelsPath).registerModels();

            // Test the connection
            await this.sequelize.authenticate();
            console.log('Database connection established successfully.');
        } catch (error) {
            console.error('Failed to initialize Sequelize:', error);
            throw error;
        }
    }

    public getModels() {
        if (!this.models || Object.keys(this.models).length === 0) {
            throw new Error('Models have not been initialized or are empty.');
        }
        return this.models;
    }

    public getModel(modelName: string) {
        if (!this.models || Object.keys(this.models).length === 0) {
            throw new Error('Models have not been initialized or are empty.');
        }
        if (!this.models[modelName]) {
            throw new Error(`Model with name ${modelName} does not exist.`);
        }
        return this.models[modelName];
    }

    public getSequelizeInstance() {
        if (!this.sequelize) {
            this.initialize();
        }
        return this.sequelize;
    }

    public async closeDBConnection() {
        if (this.sequelize) {
            await this.sequelize.close();
        }
        console.log('Database connection closed successfully.');
    }
}
