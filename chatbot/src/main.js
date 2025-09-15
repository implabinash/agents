import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { ToolNode } from "@langchain/langgraph/prebuilt";

import readline from "node:readline/promises";

const tools = [];
const toolnode = new ToolNode(tools);

const llm = new ChatGroq({
    model: "openai/gpt-oss-20b",
    temperature: 0,
    maxRetries: 2,
    apiKey: process.env.AGENT_KEy,
});

const callModel = async (state) => {
    const response = await llm.invoke(state.messages);
    return { messages: [response] };
};

const shouldContinue = (state) => {
    return "__end__";
};

const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addNode("tools", toolnode)
    .addEdge("__start__", "agent")
    .addEdge("agent", "__end__")
    .addConditionalEdges("agent", shouldContinue);

const app = workflow.compile();

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

        const finastate = await app.invoke({
            messages: [{ role: "user", content: query }],
        });

        const aiReply = finastate.messages[finastate.messages.length - 1];

        console.log("AI: ", aiReply.content);
    }
};

main();
