import Groq from "groq-sdk";
import readline from "node:readline/promises";

const groq = new Groq({ apiKey: process.env.AGENT_KEY });

let expenseDB = [];

const callAgent = async () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    let messages = [
        {
            role: "system",
            content: `You are Josh, a personal assistant. You task is to assist user with expenses, balances and finacial planning.
            Current datetime: ${new Date().toUTCString()}`,
        },
    ];

    while (true) {
        const query = await rl.question("User: ");

        if (query === "/exit") {
            break;
        }

        messages.push({
            role: "user",
            content: query,
        });

        while (true) {
            const completion = await groq.chat.completions.create({
                messages: messages,
                model: "openai/gpt-oss-20b",
                tools: [
                    {
                        type: "function",
                        function: {
                            name: "getTotalExpense",
                            description: "Get total expense from date to date",
                            parameters: {
                                type: "object",
                                properties: {
                                    from: {
                                        type: "string",
                                        description:
                                            "From date to get the expense",
                                    },
                                    to: {
                                        type: "string",
                                        description:
                                            "To date to get the expense",
                                    },
                                },
                            },
                        },
                    },
                    {
                        type: "function",
                        function: {
                            name: "addExpense",
                            description:
                                "Add a new expense to the expense database",
                            parameters: {
                                type: "object",
                                properties: {
                                    name: {
                                        type: "string",
                                        description:
                                            "Name of the expense, e.g., Baught a iPhone",
                                    },
                                    amount: {
                                        type: "string",
                                        description: "Amount of the expense",
                                    },
                                },
                            },
                        },
                    },
                ],
            });

            messages.push(completion.choices[0].message);

            const toolCalles = completion.choices[0].message.tool_calls;

            if (!toolCalles) {
                console.log(completion.choices[0].message.content);
                break;
            }

            for (const tool of toolCalles) {
                const name = tool.function.name;
                const args = tool.function.arguments;

                let result = "";

                if (name === "getTotalExpense") {
                    result = getTotalExpense(JSON.parse(args));
                } else if (name === "addExpense") {
                    result = addExpense(JSON.parse(args));
                }

                messages.push({
                    role: "tool",
                    content: result,
                    tool_call_id: tool.id,
                });
            }
        }
    }

    console.log(expenseDB);
};

callAgent();

const getTotalExpense = ({ from, to }) => {
    const totalExpense = expenseDB.reduce((acc, expense) => {
        return acc + expense.amount;
    }, 0);

    return `${totalExpense}`;
};

const addExpense = ({ name, amount }) => {
    expenseDB.push({ name, amount });
    return "Added";
};
