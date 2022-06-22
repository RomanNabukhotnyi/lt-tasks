const readline = require("readline");

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const repeatQuestion = () => {
    rl.question("Enter 10 words or digits deviding them in spaces: ", (stringOfValues) => {
        if (stringOfValues == 'exit') {
            console.log("Goodbye!");
            return rl.close();
        }
        const arrayOfValues = stringOfValues.split(" ");
        const digits = arrayOfValues.filter(item => +item);
        const words = arrayOfValues.filter(item => !digits.includes(item));
        rl.question("How would you like to sort values:" +
            "\n1. Words by name (from A to Z)." +
            "\n2. Show digits from the smallest." +
            "\n3. Show digits from the biggest." +
            "\n4. Words by quantity of leters." +
            "\n5. Only unique words." +
            "\n6. Only unique words and digits." +
            "\nSelect (1 - 6) and press ENTER: ", (num) => {
                switch (num) {
                    case "1":
                        console.log(words.sort((a, b) => a.localeCompare(b)));
                        break;

                    case "2":
                        console.log(digits.sort((a, b) => a - b));
                        break;

                    case "3":
                        console.log(digits.sort((a, b) => b - a));
                        break;

                    case "4":
                        console.log(words.sort((a, b) => b.length - a.length));
                        break;

                    case "5":
                        console.log([...new Set(words)]);
                        break;

                    case "6":
                        console.log([...new Set(arrayOfValues)]);
                        break;

                    case "exit":
                        console.log("Goodbye!");
                        return rl.close();
                }
                repeatQuestion();
            });
    });
};

repeatQuestion();

//man 22 apple table 100 93 18 apple nice grass smartphone 100293 go understandable woman 314 43.5 man 111 204 Dnipro city