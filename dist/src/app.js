"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = require("./utils/mongodb");
const firebaseAdmin_1 = require("./utils/firebaseAdmin");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
app.use(express_1.default.json()); // for parsing application/json
app.use(express_1.default.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
(0, firebaseAdmin_1.initializeFirebaseAdmin)();
//init database connection
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { db, closeClient } = yield (0, mongodb_1.connectClient)();
        res.locals.db = db;
        res.locals.closeClient = closeClient;
    }
    catch (err) {
        console.log(err);
        res.status(500).send();
    }
    next();
}));
app.get('/', (req, res) => {
    res.send("<h1>Gahoel-chat API</h1>");
});
app.listen(PORT, () => {
    return console.log(`server is listening on http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map