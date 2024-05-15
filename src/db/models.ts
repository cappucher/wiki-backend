import { Model, DataTypes } from "sequelize";
import { sequelize } from "./config";


class Page extends Model { }

Page.init(
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        visits: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        keyFacts: {
            type: DataTypes.TEXT,
            get() {
                return JSON.parse(this.getDataValue('keyFacts'));
            }
        }
    },
    {
        sequelize,
        modelName: 'Page',
    },
);

/**
 * The function `syncAllModels` synchronizes all models in the Sequelize database with an option to
 * clear existing data.
 * @param {boolean} [clear=false] - The `clear` parameter is a boolean flag that indicates whether the
 * database should be cleared before syncing the models. If `clear` is set to `true`, the database will
 * be cleared before syncing the models. If `clear` is set to `false` or not provided, the models will
 * be
 */
async function syncAllModels(clear: boolean = false) {
    await sequelize.sync({ force: clear })
}

/**
 * The `syncPage` function in TypeScript asynchronously synchronizes a page, with an optional parameter
 * to clear data if specified.
 * @param {boolean} [clear=false] - The `clear` parameter is a boolean flag that determines whether the
 * data in the `Page` model should be cleared before syncing. If `clear` is set to `true`, the data in
 * the `Page` model will be deleted before syncing. If `clear` is set to `false`
 */
async function syncPage(clear: boolean = false) {
    await Page.sync({ force: clear });
}

export { Page, syncPage, syncAllModels };