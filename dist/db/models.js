"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncAllModels = exports.syncPage = exports.Page = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("./config");
class Page extends sequelize_1.Model {
}
exports.Page = Page;
Page.init({
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    body: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    visits: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0
    },
    keyFacts: {
        type: sequelize_1.DataTypes.TEXT,
        get() {
            return JSON.parse(this.getDataValue('keyFacts'));
        }
    }
}, {
    sequelize: config_1.sequelize,
    modelName: 'Page',
});
async function syncAllModels(clear = false) {
    await config_1.sequelize.sync({ force: clear });
}
exports.syncAllModels = syncAllModels;
async function syncPage(clear = false) {
    await Page.sync({ force: clear });
}
exports.syncPage = syncPage;
//# sourceMappingURL=models.js.map