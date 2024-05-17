import dotenv from "dotenv";
import { Sequelize } from 'sequelize';

dotenv.config({ path: ".env.local" })


export const ENV_VARS = {
    PGHOST: process.env.PGHOST!,
    PGDATABASE: process.env.PGDATABASE!,
    PGUSER: process.env.PGUSER!,
    PGPASSWORD: process.env.PGPASSWORD!,
    ENDPOINT_ID: process.env.ENDPOINT_ID!,
    SECRET: process.env.SECRET!
}

// Create a Sequelize instance
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: ENV_VARS.PGHOST,
    database: ENV_VARS.PGDATABASE,
    username: ENV_VARS.PGUSER,
    password: ENV_VARS.PGPASSWORD,
    port: 5432,
    dialectOptions: {
        ssl: {
            require: true
        }
    }
});



async function checkConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Error:', error);
    }
}



export { checkConnection, sequelize }; 