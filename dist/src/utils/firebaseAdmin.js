"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeFirebaseAdmin = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const gahoel_chat_firebase_adminsdk_cwqaq_1314454b27_json_1 = __importDefault(require("../../gahoel-chat-firebase-adminsdk-cwqaq-1314454b27.json"));
const initializeFirebaseAdmin = () => {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(gahoel_chat_firebase_adminsdk_cwqaq_1314454b27_json_1.default)
    });
};
exports.initializeFirebaseAdmin = initializeFirebaseAdmin;
//# sourceMappingURL=firebaseAdmin.js.map