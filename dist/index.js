"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = require("./db/models");
const sequelize_1 = require("sequelize");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
const API_KEY = process.env.API_KEY;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("tiny"));
app.get("/", async (_, res) => {
    const allPages = await models_1.Page.findAll({
        order: [["visits", "DESC"]],
        attributes: ["title"],
        limit: 10
    });
    res.send(allPages);
});
app.get("/allPages", async (_, res) => {
    const allPages = await models_1.Page.findAll({
        attributes: ["title"]
    });
    res.send(allPages);
});
app.get("/wiki/:title", async (req, res) => {
    let title = req.params.title;
    title = title.replace(/ /g, "_");
    const page = await models_1.Page.findOne({
        where: {
            title: {
                [sequelize_1.Op.iLike]: title
            }
        }
    });
    if (page === null) {
        res.status(404).send("Page does not exist.");
        return;
    }
    if (page.dataValues.title !== title) {
        res.redirect(`/wiki/${page.dataValues.title}`);
        return;
    }
    await page.increment("visits");
    page.dataValues.keyFacts = JSON.parse(page.getDataValue("keyFacts"));
    res.status(200).send(page.dataValues);
});
app.post("/edit", async (req, res) => {
    let title = req.body.title;
    title = title.replace(/ /g, "_");
    const body = req.body.body;
    const keyFacts = JSON.stringify(req.body.keyFacts);
    const page = await models_1.Page.findOne({
        where: {
            title: {
                [sequelize_1.Op.iLike]: title
            }
        }
    });
    if (page === null) {
        res.status(404).send("Page does not exist.");
        return;
    }
    page.update({
        body: body,
        keyFacts: keyFacts
    });
    res.status(200).send("Page updated sucessfully.");
});
app.get("/random", async (_, res) => {
    const allPages = await models_1.Page.findAll({
        attributes: ["title"]
    });
    res.send(allPages[Math.floor(Math.random() * allPages.length)]);
});
app.post("/new", async (req, res) => {
    if (!req.body) {
        res.status(400).send("Bad Parameters");
        return;
    }
    const title = req.body.title.replace(/ /g, "_");
    const body = req.body.body;
    const keyFacts = JSON.stringify(req.body.keyFacts);
    const page = await models_1.Page.findOne({
        where: {
            title: {
                [sequelize_1.Op.iLike]: title
            }
        }
    });
    if (page === null) {
        await models_1.Page.create({
            title: title,
            body: body,
            keyFacts: keyFacts
        });
        res.status(201).send("Page created sucessfully.");
        return;
    }
    res.status(409).send("Page already exists.");
});
app.post("/search", async (req, res) => {
    let title = req.body.title;
    title = title.replace(/ /g, "_");
    const page = await models_1.Page.findOne({
        where: {
            title: {
                [sequelize_1.Op.iLike]: title
            }
        }
    });
    if (page !== null) {
        res.send(false);
        return;
    }
    const pages = await models_1.Page.findAll({
        where: {
            title: {
                [sequelize_1.Op.iLike]: `%${title}%`
            }
        }
    });
    res.send(pages);
});
app.listen(3030, () => {
    console.log("Up and running");
});
//# sourceMappingURL=index.js.map