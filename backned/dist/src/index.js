"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routes/admin/index"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const index_2 = __importDefault(require("./routes/club/index"));
const index_3 = __importDefault(require("./routes/application/index"));
const index_4 = __importDefault(require("./routes/uploads/index"));
const index_5 = __importDefault(require("./routes/auth/index"));
const index_6 = __importDefault(require("./routes/payments/index"));
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Health is ok!");
});
app.use("/api/v1/auth/me", index_5.default);
app.use("/api/v1/users", user_routes_1.default);
app.use("/api/v1/admin", index_1.default);
app.use("/api/v1/clubs", index_2.default);
app.use('/api/v1/applications', index_3.default);
app.use('/api/v1/document', index_4.default);
app.use('/api/v1/payments', index_6.default);
app.listen(port, () => {
    console.log(`server is running on ${port}`);
});
