import { NextFunction, Request, Response } from "express";
import { ENV_VARS } from "./db/config";

const verifyAdminToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('X-Admin-Token');
    if (token && token === ENV_VARS.SECRET) {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
};

export { verifyAdminToken };