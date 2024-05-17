"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.checkConnection = exports.ENV_VARS = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
dotenv_1.default.config({ path: ".env.local" });
exports.ENV_VARS = {
    PGHOST: process.env.PGHOST,
    PGDATABASE: process.env.PGDATABASE,
    PGUSER: process.env.PGUSER,
    PGPASSWORD: process.env.PGPASSWORD,
    ENDPOINT_ID: process.env.ENDPOINT_ID,
    SECRET: process.env.SECRET
};
const sequelize = new sequelize_1.Sequelize({
    dialect: 'postgres',
    host: exports.ENV_VARS.PGHOST,
    database: exports.ENV_VARS.PGDATABASE,
    username: exports.ENV_VARS.PGUSER,
    password: exports.ENV_VARS.PGPASSWORD,
    port: 5432,
    dialectOptions: {
        ssl: {
            require: true
        }
    }
});
exports.sequelize = sequelize;
async function checkConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    }
    catch (error) {
        console.error('Error:', error);
    }
}
exports.checkConnection = checkConnection;
//# sourceMappingURL=config.js.map