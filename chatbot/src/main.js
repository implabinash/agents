import readline from "node:readline/promises";

const main = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    while (true) {
        const query = await rl.question("User: ");

        if (query === "/exit") {
            rl.close();
            break;
        }

        console.log(`${query}\n`);
    }
};

main();
