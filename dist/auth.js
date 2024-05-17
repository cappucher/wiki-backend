"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdminToken = void 0;
const config_1 = require("./db/config");
const verifyAdminToken = (req, res, next) => {
    const token = req.header('X-Admin-Token');
    if (token && token === config_1.ENV_VARS.SECRET) {
        next();
    }
    else {
        res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
};
exports.verifyAdminToken = verifyAdminToken;
//# sourceMappingURL=auth.js.map