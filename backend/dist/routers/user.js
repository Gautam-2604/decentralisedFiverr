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
const client_1 = require("@prisma/client");
const express_1 = require("express");
const JWT_SECRET = "gg12345";
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const prismaClient = new client_1.PrismaClient();
//sig in with wallet
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Will add signing logic later
    const hardCodedWalletAddress = "123456789GAutam";
    const user = yield prismaClient.user.findFirst({
        where: {
            address: hardCodedWalletAddress
        }
    });
    if (user) {
        const token = jsonwebtoken_1.default.sign({
            userId: user.id
        }, JWT_SECRET);
        res.json({
            token
        });
    }
    else {
        const newUser = yield prismaClient.user.create({
            data: {
                address: hardCodedWalletAddress
            }
        });
    }
}));
exports.default = router;
