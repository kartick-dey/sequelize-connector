import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import { ModelDefinition } from './types';

class ModelRegistrar {
    private sequelize: Sequelize;
    private modelsPath: string;
    private models: { [key: string]: any } = {};

    constructor(sequelize: Sequelize, modelsPath: string) {
        this.sequelize = sequelize;
        this.modelsPath = modelsPath;
    }

    public registerModels(): { [key: string]: any } {
        fs.readdirSync(this.modelsPath).forEach((file) => {
            if (file.endsWith('.js') || file.endsWith('.ts')) {
                const modelDef: ModelDefinition = require(path.join(this.modelsPath, file)).default;
                const model = modelDef(this.sequelize, DataTypes);
                this.models[model.name] = model;
            }
        });

        // Handle associations if defined
        Object.values(this.models).forEach((model) => {
            if (model.associate) {
                model.associate(this.models);
            }
        });

        return this.models;
    }
}

export default ModelRegistrar;
