const express = require("express");
const https = require("https")
const fs = require("fs");
const fileContent = fs.readFileSync("IP2LOCATION-LITE-DB1.CSV", "utf8").replaceAll("\"", "").split("\r\n");
let rows = [];

fileContent.forEach(string => {
    rows.push(string.split(","));
});

const PORT = 3000;
const app = express();

const foo = (string) => {
    let ip = 0;
    let ipAddressInArray = string.split(".");
    ipAddressInArray.forEach((val, i) => {
        ip += ipAddressInArray[i] * Math.pow(256, 3 - i);
    });
    for (let row of rows) {
        if (Number(row[0]) <= ip && ip <= Number(row[1])) {
            return row[3];
        }
    }
}

app.get("/", (req, res) => {
    https.get("https://api.ipify.org/?format=json", response => {
        let data = "";
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on("end", () => {
            data = JSON.parse(data);
            data["country"] = foo(data.ip);
            res.send(data);
        })
    })
});

app.listen(PORT, () => {
    console.log(`The server has started(http://localhost:${PORT}/)...`);
});
