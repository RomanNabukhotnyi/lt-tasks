const express = require("express");
const router = require("./router")
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser())
app.use("/", router);

app.listen(PORT, () => {
    console.log(`The server has started(http://localhost:${PORT}/)...`);
});