import "dotenv/config.js";
import { BeeAgent } from "bee-agent-framework/agents/bee/agent";
import { FrameworkError } from "bee-agent-framework/errors";
import { TokenMemory } from "bee-agent-framework/memory/tokenMemory";
import { DuckDuckGoSearchTool } from "bee-agent-framework/tools/search/duckDuckGoSearch";
import { OpenMeteoTool } from "bee-agent-framework/tools/weather/openMeteo";
import { OllamaChatLLM } from "bee-agent-framework/adapters/ollama/chat";
import * as fs from "node:fs";
import * as process from "node:process";

const llm = new OllamaChatLLM({
  modelId: "llama3.1",
  parameters: {
    temperature: 0,
  },
});

const agent = new BeeAgent({
  llm,
  memory: new TokenMemory({ llm }),
  tools: [new DuckDuckGoSearchTool(), new OpenMeteoTool()],
});

const getPrompt = () => {
  const fallback = `What is the current weather in Las Vegas?`
  if (process.stdin.isTTY) {
    return fallback
  }
  return fs.readFileSync(process.stdin.fd).toString().trim() || fallback
}

try {
  const prompt = getPrompt();
  console.info(`User 👤 : ${prompt}`);

  const response = await agent
    .run(
      { prompt },
      {
        execution: {
          maxIterations: 8,
          maxRetriesPerStep: 3,
          totalMaxRetries: 10,
        },
      },
    )
    .observe((emitter) => {
      emitter.on("update", (data) => {
        console.info(`Agent 🤖 (${data.update.key}) : ${data.update.value}`);
      });
    });
  console.info(`Agent 🤖 : ${response.result.text}`);
} catch (error) {
  console.error(FrameworkError.ensure(error).dump());
} finally {
  process.exit(0);
}
