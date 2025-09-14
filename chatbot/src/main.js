import readline from "node:readline/promises";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const query = await rl.question("Hi: ");

rl.close();

console.log(query);
