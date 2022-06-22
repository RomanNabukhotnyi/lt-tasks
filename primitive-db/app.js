import inquirer from "inquirer";
import fs from "fs";
let fileContent = JSON.parse(fs.readFileSync("db.txt", "utf8"));

const repeatQuestion = () => {
    inquirer.prompt([
        {
            name: "name",
            message: "Enter the user's name. To cancel press ENTER: ",
            type: "input",
        },
        {
            name: "gender",
            message: "Choose your Gender: ",
            type: "list",
            choices: ["Male", "Female"],
            when: ({ name }) => name != "",
        },
        {
            name: "age",
            message: "Enter your age: ",
            type: "number",
            when: ({ name }) => name != "",
        },
    ]).then(answers => {
        if (answers.name != "") {
            fileContent.push(answers);
            repeatQuestion();
        } else {
            fs.writeFileSync("db.txt", JSON.stringify(fileContent));
            inquirer.prompt([
                {
                    name: "search",
                    message: "Would you to search values in DB? ",
                    type: "confirm",
                },
            ]).then(({ search }) => {
                if (search) {
                    console.log(fileContent);
                    inquirer.prompt([
                        {
                            name: "name",
                            message: "Enter user's name you wanna find in DB: ",
                            type: "input",
                        },
                    ]).then(({ name }) => {
                        const user = fileContent.find(user => user.name === name);
                        if (user) {
                            console.log(`User ${name} was found.`);
                            console.log(user);
                        } else {
                            console.log(`User ${name} was not found.`);
                        }
                    });
                }
            });
        }
        return;
    });
}

repeatQuestion();