import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.AGENT_KEY });

const callAgent = async () => {
    const completion = await groq.chat.completions
        .create({
            messages: [
                {
                    role: "system",
                    content:
                        "You are Josh, a personal assistant. You task is to assist user with expenses, balances and finacial planning.",
                },
                {
                    role: "user",
                    content: "Who are you?",
                },
            ],
            model: "openai/gpt-oss-20b",
            tools: [
                {
                    type: "function",
                },
            ],
        })
        .then((chatCompletion) => {
            console.log(chatCompletion.choices[0]?.message?.content || "");
        });
};

callAgent();

const getTotalExpense = ({ from, to }) => {
    console.log("calling getTotalExpense tool");

    return 10_000;
};
