"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const userRouter = (0, express_1.Router)();
userRouter.post("/register", (0, express_validator_1.body)("username").escape(), (0, express_validator_1.body)("password"), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        //console.log(errors);
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const existingUser = await User_1.User.findOne({ username: req.body.username });
        //console.log(existingUser)
        if (existingUser) {
            return res.status(403).json({ username: "username already in use" });
        }
        const salt = bcrypt_1.default.genSaltSync(10);
        const hash = bcrypt_1.default.hashSync(req.body.password, salt);
        await User_1.User.create({
            username: req.body.username,
            password: hash
        });
        return res.status(200).json({ message: "User registered successfully" });
    }
    catch (error) {
        console.error(`Error during registration: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
userRouter.get("/list", async (req, res) => {
    try {
        const users = await User_1.User.find();
        return res.status(200).json(users);
    }
    catch (error) {
        console.error(`Error fetching user list: ${error}`);
        return res.status(500).json({ error: "Internal server error" });
    }
});
userRouter.post("/login", (0, express_validator_1.body)("username").escape(), (0, express_validator_1.body)("password"), async (req, res) => {
    try {
        const existingUser = await User_1.User.findOne({ username: req.body.username });
        if (!existingUser) {
            return res.status(401).json({ message: "Login failed" });
        }
        const userId = existingUser._id;
        if (bcrypt_1.default.compareSync(req.body.password, existingUser.password)) {
            const JwtPayload = {
                username: existingUser.username
            };
            const token = jsonwebtoken_1.default.sign(JwtPayload, process.env.SECRET);
            return res.status(200).json({ success: true, token, userId });
        }
        return res.status(401).json({ message: "Login failed" });
    }
    catch (error) {
        console.error(`Error during user login: ${error}`);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = userRouter;
