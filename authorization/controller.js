const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb+srv://roman:12345@cluster0.bzv0w.mongodb.net/auth?retryWrites=true&w=majority");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { accessSecret, refreshSecret } = require("./config");

const database = async () => {
    await client.connect();
}
database();

const db = client.db("db");
const collection = db.collection("users");
const tokenDb = db.collection("tokens")

const generateTokens = (login) => {
    const payload = {
        login
    }
    const accessToken = jwt.sign(payload, accessSecret, { expiresIn: `${Math.floor(Math.random() * 31) + 30}s` });
    const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: `1m` });
    return {
        accessToken,
        refreshToken
    }
}

const saveToken = async (email, refreshToken) => {
    const tokenDate = await tokenDb.findOne({ email });
    if (tokenDate) {
        await tokenDb.updateOne(tokenDate, { $set: { refreshToken } })
    } else {
        await tokenDb.insertOne({
            email: email,
            refreshToken: refreshToken
        })
    }
}

const validToken = (token, secret) => {
    try {
        const decodeData = jwt.verify(token, secret);
        return decodeData;
    } catch (error) {
        return null;
    }
}

let num = 1;
class controller {
    async registration(req, res) {
        const { email, password } = req.body;
        if (await collection.findOne({ email })) {
            return res.status(400).json({ message: "A user with this email is already registered" })
        }
        const hashPassword = bcrypt.hashSync(password, 5);
        const user = {
            email: email,
            password: hashPassword
        }
        await collection.insertOne(user);
        const tokens = generateTokens(email);
        await saveToken(email, tokens.refreshToken);
        res.cookie("refreshToken", tokens.refreshToken, { maxAge: 60 * 1000, httpOnly: true });
        return res.json({ message: "User successfully registered" });
    }
    async login(req, res) {
        const { email, password } = req.body;
        const user = await collection.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "No user with this email was found" })
        }
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Incorrect password entered" })
        }
        const tokens = generateTokens(email);
        await saveToken(email, tokens.refreshToken);
        return res.json({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken })
    }
    async refresh(req, res) {
        const { refreshToken } = req.body;
        const isValid = validToken(refreshToken, refreshSecret);
        const tokenFromDb = await tokenDb.findOne({ refreshToken });
        if (!isValid || !tokenFromDb) {
            return res.status(400).json({ message: "User is unauthorized" })
        }
        const tokens = generateTokens(tokenFromDb.email);
        await saveToken(tokenFromDb.email, tokens.refreshToken);
        res.cookie("refreshToken", tokens.refreshToken, { maxAge: 60 * 1000, httpOnly: true });
        res.json({ token: tokens.accessToken })
    }
    async getUser(req, res) {
        res.json({
            reques_num: num++,
            data: {
                username: req.user.login
            }
        });
    }
}

module.exports = new controller();