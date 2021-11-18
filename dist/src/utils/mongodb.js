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
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectClient = void 0;
const mongodb_1 = require("mongodb");
const PASSWORD = process.env.MONGODB_PASSWORD;
const USERNAME = process.env.MONGODB_USERNAME;
const DATABASE_NAME = 'gahoel-chat';
const URI = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.y35vz.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority`;
const connectClient = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(URI);
    yield client.connect();
    const db = client.db(DATABASE_NAME);
    return {
        db,
        closeClient: () => __awaiter(void 0, void 0, void 0, function* () {
            yield client.close();
        })
    };
});
exports.connectClient = connectClient;
//# sourceMappingURL=mongodb.js.map