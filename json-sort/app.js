const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require("fs");
const endpoints = fs.readFileSync("endpoints.txt", "utf8").split("\r\n");

const doRequest = async (url, n = 3) => {
    try {
        return await fetch(url);
    } catch (error) {
        if (n == 0) console.log(error);
        return await doRequest(url, --n);
    }
};

const enumeration = (object) => {
    if ("isDone" in object) {
        return object["isDone"];
    }
    for (let key of Object.keys(object)) {
        if (typeof object[key] == "object") {
            let result = enumeration(object[key]);
            if (typeof result == "boolean") {
                return result;
            }
        }
    }
    return undefined;
};
const start = async () => {
    let numTrue = 0, numFalse = 0;
    for (let endpoint of endpoints) {
        const res = await doRequest(endpoint);
        const obj = await res.json();
        const value = enumeration(obj);
        value == true ? ++numTrue : ++numFalse;
        console.log(`${endpoint}: isDone - ${value}`);
    }
    console.log("Values True:", numTrue);
    console.log("Values False:", numFalse);
};

start();