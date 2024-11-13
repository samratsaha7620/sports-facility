"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const index_1 = __importDefault(require("./routes/club/index"));
const index_2 = __importDefault(require("./routes/application/index"));
const index_3 = __importDefault(require("./routes/uploads/index"));
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Health is ok!");
});
app.use("/api/v1/users", user_routes_1.default);
app.use("/api/v1/clubs", index_1.default);
app.use('/api/v1/applications', index_2.default);
app.use('/api/v1/document', index_3.default);
app.listen(port, () => {
    console.log(`server is running on ${port}`);
});
