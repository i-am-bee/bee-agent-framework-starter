import { WatsonXChatLLM } from "bee-agent-framework/adapters/watsonx/chat";
import { BeeAgent } from "bee-agent-framework/agents/bee/agent";
import { TokenMemory } from "bee-agent-framework/memory/tokenMemory";
import { DuckDuckGoSearchTool } from "bee-agent-framework/tools/search/duckDuckGoSearch";
import { OpenMeteoTool } from "bee-agent-framework/tools/weather/openMeteo";
import chalk from "chalk";
import "dotenv/config";
import cliChat from "./helpers/cli_chat.js";

const llm = WatsonXChatLLM.fromPreset("meta-llama/llama-3-70b-instruct", {
  apiKey: process.env.WATSONX_API_KEY,
  projectId: process.env.WATSONX_PROJECT_ID,
  parameters: {
    decoding_method: "greedy",
    max_new_tokens: 1500,
  },
});

try {
  console.clear();

  console.log(
    `\nHi! I am ${chalk.yellow("Bee")} 🐝 Agent!\n${chalk.gray("type 'exit' at anytime to quit")}\n`,
  );

  const agent = new BeeAgent({
    llm,
    memory: new TokenMemory({ llm }),
    tools: [new DuckDuckGoSearchTool(), new OpenMeteoTool()],
  });

  await cliChat(agent);
} catch (error) {
  console.error(error);
}
