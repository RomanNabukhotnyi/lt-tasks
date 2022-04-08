const fs = require("fs");
let fileContent = fs.readFileSync("file.json", "utf8");
fileContent = JSON.parse(fileContent);

let map = fileContent.reduce((acc, object) => {
    let id = object.user._id;
    acc[id] = acc[id] ? [...acc[id], object] : [object];
    return acc;
}, {});

let result = [];

Object.keys(map).forEach((user) => {
    let dates = [];
    map[user].forEach((object) => {
        let date = { 
            startDate: object.startDate, 
            endDate: object.endDate 
        };
        dates.push(date);
    });
    let object = {
        userId: map[user][0].user._id,
        name: map[user][0].user.name,
        weekendDates: dates
    };
    result.push(object);
});

fs.writeFileSync("result.json", JSON.stringify(result, null, 2));