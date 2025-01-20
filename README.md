# Sequelize Connector

`sequelize-connector` is an npm package that simplifies the process of connecting to a Sequelize database like 'mysql' | 'postgres' | 'mariadb' | 'mssql' | 'db2' | 'oracle' | 'snowflake'. It provides an easy-to-use interface for setting up and managing database connections.

## Installation

To install the package, use npm:

```bash
npm install sequelize-connector
```

## Usage

### Setting Up the Connection

First, import the `sequelize-connector` package and configure your database connection:

<p>db/index.ts</p>

```javascript
import path from 'path';
import { SequelizeConnector } from 'sequelize-connector';
import { SequelizeConnectorOptions } from 'sequelize-connector/dist/types';

const sqConf: SequelizeConnectorOptions = {
    dbConfig: {
        dbDialect: 'mysql',
        dbHost: 'localhost',
        dbName: 'todo',
        dbUser: 'root',
        dbPassword: 'root',
        dbLogging: false,
    },
    modelsPath: path.join(__dirname, '../models'),
};
const connector = new SequelizeConnector(sqConf);
const dbInstance = connector.getSequelizeInstance();
const getModels = connector.getModels.bind(connector);
const getModel = connector.getModel.bind(connector);
const closeDBConnection = connector.closeDBConnection.bind(connector);

export { dbInstance, getModels, getModel, closeDBConnection };
```

### Defining Models

Define your models using Sequelize:

```javascript
import { Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
    const User = sequelize.define(
        'Users',
        {
            id: {
                type: dataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: dataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: dataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            tableName: 'users',
            timestamps: false,
        },
    );

    return User;
};
```

### Syncing the Database

Sync your models with the database:

```javascript
sequelize.sync({ force: true }).then(() => {
    console.log('Database & tables created!');
});
```

### Sample Code

Here's a sample code to create and retrieve data:

```javascript
// Create a new user
import { getModel } from '../db/index';

await getModel('User')
    .create({
        name: 'Kartick Dey',
        email: 'kartick@kd.com',
    })
    .then((user) => {
        console.log('User created:', user.toJSON());
    });

// Retrieve all users
await getModel('User')
    .findAll()
    .then((users) => {
        console.log('All users:', JSON.stringify(users, null, 2));
    });
```

| Method | Comments |
| ------ | -------- |

/\*\*

-   @function getSequelizeInstance
-   @description This function returns an instance of Sequelize, which is used to interact with the database.
-   @returns {Sequelize} An instance of Sequelize.
    \*/
    | getSequelizeInstance | |
    // This section documents the `getModel` function.
    // The `getModel` function is used to retrieve a Sequelize model by its name.
    // It is typically used to interact with the database models defined in your Sequelize setup.
    | getModel | |

    /\*\*

    -   @function getModels
    -   @description Retrieves all the models defined in the Sequelize instance.
    -   @returns {Object} An object containing all the Sequelize models.
        \*/
        | getModels | |
        | closeDBConnection | |
        |-------------------|---|
        | Description | Closes the current database connection. |
        | Parameters | None |
        | Returns | Promise<void> - Resolves when the connection is successfully closed. |

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## Contact

For any questions or issues, please contact [kartick.dey1995@gmail.com](kartick.dey1995@gmail.com).
