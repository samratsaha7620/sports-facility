"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function authorizeRole(role) {
    return (req, res, next) => {
        //@ts-ignore
        const user = req.user;
        if ((user === null || user === void 0 ? void 0 : user.role) !== role) {
            res.status(403).json({ message: "Forbidden: Permission Denied" });
            return;
        }
        next();
    };
}
exports.default = authorizeRole;
