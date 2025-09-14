import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.AGENT_KEY });

const callAgent = async () => {
    let messages = [
        {
            role: "system",
            content: `You are Josh, a personal assistant. You task is to assist user with expenses, balances and finacial planning.
            Current datetime: ${new Date().toUTCString()}`,
        },
    ];

    messages.push({
        role: "user",
        content: "How much money I have spent this month?",
    });

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

    messages.push(completion.choices[0].message);

    const toolCalles = completion.choices[0].message.tool_calls;

    if (!toolCalles) {
        console.log(completion.choices[0].message.content);
        return;
    }

    for (const tool of toolCalles) {
        const name = tool.function.name;
        const args = tool.function.arguments;

        let result = "";
        if (name === "getTotalExpense") {
            result = getTotalExpense(JSON.parse(args));
        }

        messages.push({
            role: "tool",
            content: result,
            tool_call_id: tool.id,
        });

        const completion2 = await groq.chat.completions.create({
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

        console.log(completion2.choices[0].message.content);
    }
};

callAgent();

const getTotalExpense = ({ from, to }) => {
    return "12000";
};
