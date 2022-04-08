const fs = require("fs");
const path = require("path");
const pathToFiles = "files/2kk_words";
const files = fs.readdirSync(pathToFiles);

let usernames = [];

console.time("concat");
files.forEach((file) => {
    usernames = usernames.concat([...new Set(fs.readFileSync(path.join(pathToFiles, file), "utf8").split("\n"))]);
});
console.timeEnd("concat");

console.time("map");
let map = usernames.reduce((acc, i) => {
    acc[i] = acc[i] ? acc[i] + 1 : 1;
    return acc;
}, {});
console.timeEnd("map");

const uniqueValues = () => {
    return Object.keys(map).length;
};

const existInAllFiles = () => {
    let count=0;
    Object.keys(map).forEach((username) => {
        if (map[username] == 20) {
            count++;
        }
    });
    return count;
};

const existInAtLeastTen = () => {
    let count=0;
    Object.keys(map).forEach((username) => {
        if (map[username] >= 10) {
            count++;
        }
    });
    return count;
};

let time = new Date().getTime();
console.log("Unique usernames:", uniqueValues(), `${new Date().getTime() - time}ms`);

time = new Date().getTime();
console.log("Usernames that are in all 20 files:", existInAllFiles(), `${new Date().getTime() - time}ms`);

time = new Date().getTime();
console.log("Usernames that are in at least ten files:", existInAtLeastTen(), `${new Date().getTime() - time}ms`);