import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.AGENT_KEY });

const callAgent = async () => {
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are Josh, a personal assistant. You task is to assist user with expenses, balances and finacial planning.
                    Current datetime: ${new Date().toUTCString()}`,
            },
            {
                role: "user",
                content: "How much money I have spent this month?",
            },
        ],
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
                                description: "From date to get the expense",
                            },
                            to: {
                                type: "string",
                                description: "To date to get the expense",
                            },
                        },
                    },
                },
            },
        ],
    });

    console.log(JSON.stringify(completion.choices[0], null, 2));
};

callAgent();

const getTotalExpense = ({ from, to }) => {
    console.log("calling getTotalExpense tool. From: ", from, "To: ", to);

    return 10_000;
};
