const express = require("express");
const calcPrice = require('./func/calcPrice');
const calcTime = require('./func/calcTime');
const calcDeadline = require('./func/calcDeadline');

const app = express();
const PORT = 3000;

app.post("/post", express.json(), (req, res) => {
    if (!req.body) return res.sendStatus(400);
    const price = calcPrice(req.body.language, req.body.mimetype, req.body.count);
    const time = calcTime(req.body.language, req.body.mimetype, req.body.count);
    const deadline = calcDeadline(time);
    res.send({
        price: price,
        time: time,
        deadline: deadline/1000,
        deadline_date: new Date(deadline).toLocaleString()
    });
});

app.listen(PORT, () => {
    console.log(`The server has started(http://localhost:${PORT}/)...`);
});