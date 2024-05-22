import express, { Request, Response } from "express";
// import { checkConnection } from "./db/config";
import { Page } from "./db/models";
import { Op } from "sequelize";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import { verifyAdminToken } from "./auth";
import { profanity } from '@2toad/profanity';


const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('combined'));
app.use(verifyAdminToken);


app.get("/", async (_, res: Response) => {
    const allPages: Page[] = await Page.findAll({
        order: [["visits", "DESC"]],
        attributes: ["title"],
        limit: 10
    });
    res.send(allPages);
});


app.get("/allPages", async (_, res: Response) => {
    const allPages: Page[] = await Page.findAll({
        order: [["title", "ASC"]],
        attributes: ["title"]
    });
    res.send(allPages);
})

app.get("/wiki/:title", async (req: Request, res: Response) => {
    let title: string = req.params.title;
    title = title.replace(/ /g, "_");

    const page: Page | null = await Page.findOne({
        where: {
            title: {
                [Op.iLike]: title
            }
        }
    })
    if (page === null) {
        res.status(404).send({ message: "Page does not exist." });
        return;
    }
    if (page.dataValues.title !== title) {
        res.redirect(`/wiki/${page!.dataValues.title}`);
        return;
    }
    await page.increment("visits");
    page!.dataValues.keyFacts = JSON.parse(page.getDataValue("keyFacts"));
    res.status(200).send(page.dataValues);
})

app.post("/edit", async (req: Request, res: Response) => {
    let title: string = req.body.title;
    title = title.replace(/ /g, "_");

    const body: string = req.body.body;
    const keyFacts: string = JSON.stringify(req.body.keyFacts);

    const page: Page | null = await Page.findOne({
        where: {
            title: {
                [Op.iLike]: title
            }
        }
    })
    if (page === null) {
        res.status(404).send("Page does not exist.");
        return;
    }

    page.update({
        body: body,
        keyFacts: keyFacts
    })
    res.status(200).send("Page updated sucessfully.");
})

app.post("/random", async (req: Request, res: Response) => {
    const allPages: Page[] = await Page.findAll({
        attributes: ["title"]
    });
    res.send(allPages[Math.floor(req.body.randomSeed * allPages.length)]);
})

app.post("/new", async (req: Request, res: Response) => {
    if (!req.body) {
        res.status(400).send("Bad Parameters");
        return;
    }

    const title: string = req.body.title.replace(/ /g, "_");
    if (profanity.exists(title)) {
        res.status(400).send({ message: "Profanity in title. Please edit." })
        return;
    }
    const body: string = req.body.body;
    const keyFacts: string = JSON.stringify(req.body.keyFacts);

    const page: Page | null = await Page.findOne({
        where: {
            title: {
                [Op.iLike]: title
            }
        }
    })
    if (page === null) {
        await Page.create({
            title: title,
            body: body,
            keyFacts: keyFacts
        });
        res.status(201).send({ message: "Page created sucessfully." });
        return;
    }
    res.status(409).send({ message: "Page already exists." });
})

app.post("/search", async (req: Request, res: Response) => {
    let title: string = req.body.title;
    title = title.replace(/ /g, "_");

    const page: Page | null = await Page.findOne({
        where: {
            title: {
                [Op.iLike]: title
            }
        }
    })
    if (page !== null) {
        res.send(false);
        return;
    }

    const pages: Page[] = await Page.findAll({
        where: {
            title: {
                [Op.iLike]: `%${title}%`
            }
        }
    })
    res.send(pages);
})

app.listen(3030, () => {
    console.log("Up and running");
})