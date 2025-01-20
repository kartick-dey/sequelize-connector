import { SequelizeConnector } from '../src/index';
import { SequelizeConnectorOptions } from '../src/types';
import DatabaseConnector from '../src/database';
import ModelRegistrar from '../src/modelRegistrar';

jest.mock('../src/database', () => {
    return jest.fn().mockImplementation(() => ({
        getSequelizeInstance: jest.fn().mockReturnValue({
            authenticate: jest.fn().mockResolvedValue(true),
            close: jest.fn().mockResolvedValue(true),
        }),
    }));
});

jest.mock('../src/modelRegistrar', () => {
    return jest.fn().mockImplementation(() => ({
        registerModels: jest.fn().mockReturnValue({
            User: { name: 'User' },
            Post: { name: 'Post' },
        }),
    }));
});

describe('SequelizeConnector', () => {
    let connector: SequelizeConnector;
    const mockOptions: SequelizeConnectorOptions = {
        dbConfig: { dbName: 'test', dbUser: 'user', dbPassword: 'pass', dbHost: 'localhost', dbDialect: 'mysql', dbLogging: false },
        modelsPath: './models',
    };

    beforeEach(() => {
        connector = new SequelizeConnector(mockOptions);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize and authenticate the database connection', async () => {
        const authenticateSpy = jest.spyOn(DatabaseConnector.prototype.getSequelizeInstance(), 'authenticate');
        await connector.getSequelizeInstance().authenticate();

        expect(DatabaseConnector).toHaveBeenCalledWith(mockOptions.dbConfig);
        expect(ModelRegistrar).toHaveBeenCalledWith(expect.any(Object), mockOptions.modelsPath);
        expect(authenticateSpy).toHaveBeenCalled();
    });

    it('should return the registered models', () => {
        const models = connector.getModels();
        expect(models).toHaveProperty('User');
        expect(models).toHaveProperty('Post');
    });

    it('should return a specific model by name', () => {
        const userModel = connector.getModel('User');
        expect(userModel).toEqual({ name: 'User' });
    });

    it('should throw an error if a model does not exist', () => {
        expect(() => connector.getModel('NonExistentModel')).toThrow('Model with name NonExistentModel does not exist.');
    });

    it('should throw an error if models are not initialized', () => {
        const emptyConnector = new SequelizeConnector({
            dbConfig: mockOptions.dbConfig,
            modelsPath: './empty',
        });

        jest.spyOn(ModelRegistrar.prototype, 'registerModels').mockReturnValue({});

        expect(() => emptyConnector.getModels()).toThrow('Models have not been initialized or are empty.');
    });

    it('should close the database connection', async () => {
        const closeSpy = jest.spyOn(DatabaseConnector.prototype.getSequelizeInstance(), 'close');
        await connector.closeDBConnection();

        expect(closeSpy).toHaveBeenCalled();
    });
});
