const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb+srv://roman:12345@cluster0.9r26m.mongodb.net/Authorization?retryWrites=true&w=majority");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { secret } = require("./config");

const database = async () => {
    await client.connect();
}
database();

const db = client.db("usersdb");
const collection = db.collection("users");

const generateAccessToken = (login) => {
    const payload = {
        login
    }
    return jwt.sign(payload, secret, { expiresIn: `${Math.floor(Math.random() * 31) + 30}s` })
}

let num = 1;
class controller {
    async registration(req, res) {
        const { email, password } = req.body;
        if (await collection.findOne({ email })) {
            return res.status(400).json({ message: "A user with this email is already registered" })
        }
        const hashPassword=bcrypt.hashSync(password, 5);
        const user = {
            email: email,
            password: hashPassword
        }
        collection.insertOne(user);
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
        const token = generateAccessToken(user.email);
        return res.json({ token })
    }
    async refresh(req, res) {
        res.json({
            token: generateAccessToken(jwt.decode(req.headers.authorization.split(" ")[1]), secret)
        })
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