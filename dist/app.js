"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const firebase_admin_1 = __importStar(require("firebase-admin"));
const serviceAccount = require('../gahoel-chat-firebase-adminsdk-cwqaq-1314454b27.json');
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount)
});
const app = (0, express_1.default)();
const port = 3000;
app.get('/', (req, res) => {
    // This registration token comes from the client FCM SDKs.
    const registrationToken = 'czIg5XgkTYSOW3C3v-LxaZ:APA91bEI_WpUrl0itGI2l4r-ixjuO_RzhEzmMF5oRQeZZvLMqZ0EQRazFYdJkCq9kOVznwLGkK3Fq_FrPE2SeSvYATUp0oM74HDW5gfEgE0_ylvlqF2p1mmlHoylzkE8DeJgYsBI411j';
    const message = {
        notification: {
            title: '850',
            body: '2:45'
        },
        token: registrationToken
    };
    // Send a message to the device corresponding to the provided
    // registration token.
    (0, firebase_admin_1.messaging)().send(message).then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
    }).catch((error) => {
        console.log('Error sending message:', error);
    });
    res.send("<h1>Jembut</h1>");
});
app.listen(port, () => {
    return console.log(`server is listening on http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map