import express from "express";
import {createRouter} from "./router"
const PORT = process.env.PORT || 3000;

const app = express();
const router = createRouter();
app.use(express.json());
app.use("/", router);

app.listen(PORT, () => {
    console.log(`The server has started(http://localhost:${PORT}/)...`);
});