import "./hooks/telemetry.js";
import "dotenv/config.js";
import { BeeAgent } from "bee-agent-framework/agents/bee/agent";
import { FrameworkError } from "bee-agent-framework/errors";
import { TokenMemory } from "bee-agent-framework/memory/tokenMemory";
import { OpenMeteoTool } from "bee-agent-framework/tools/weather/openMeteo";
import { WikipediaTool } from "bee-agent-framework/tools/search/wikipedia";
import { createConsoleReader } from "./helpers/reader.js";
import { ChatModel } from "bee-agent-framework/backend/chat";
import process from "node:process";

const agent = new BeeAgent({
  llm: await ChatModel.fromName(process.env.LLM_CHAT_MODEL_NAME as any),
  memory: new TokenMemory(),
  tools: [new OpenMeteoTool(), new WikipediaTool()],
});

const reader = createConsoleReader({ fallback: `What is the current weather in Las Vegas?` });
for await (const { prompt } of reader) {
  try {
    const response = await agent.run(
      { prompt },
      {
        execution: {
          maxIterations: 8,
          maxRetriesPerStep: 3,
          totalMaxRetries: 10,
        },
      },
    );

    reader.write(`Agent 🤖 : `, response.result.text);
  } catch (error) {
    reader.write(`Error`, FrameworkError.ensure(error).dump());
  }
}
