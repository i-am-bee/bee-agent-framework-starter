import "dotenv/config.js";
import { BeeAgent } from "bee-agent-framework/agents/bee/agent";
import { FrameworkError } from "bee-agent-framework/errors";
import { TokenMemory } from "bee-agent-framework/memory/tokenMemory";
import { DuckDuckGoSearchTool } from "bee-agent-framework/tools/search/duckDuckGoSearch";
import { OpenMeteoTool } from "bee-agent-framework/tools/weather/openMeteo";
import * as process from "node:process";
import { createObserveConnector, ObserveError } from "bee-observe-connector";
import { getChatLLM } from "./helpers/llm.js";
import { getPrompt } from "./helpers/prompt.js";

const llm = getChatLLM();

const agent = new BeeAgent({
  llm,
  memory: new TokenMemory({ llm }),
  tools: [new DuckDuckGoSearchTool(), new OpenMeteoTool()],
});

try {
  const prompt = getPrompt(`What is the current weather in Las Vegas?`);
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
    .middleware(
      createObserveConnector({
        api: {
          baseUrl: "http://127.0.0.1:4002",
          apiAuthKey: "testing-api-key",
        },
        cb: async (err, data) => {
          if (err) {
            console.error(`Agent 🤖 : `, ObserveError.ensure(err).explain());
          } else {
            console.info(`Observe 🔎`, data?.result?.response?.text || "Invalid result.");
            console.info(
              `Observe 🔎`,
              `Trace has been created and will shortly be available at http://127.0.0.1:8080/#/experiments/0`,
            );
          }
        },
      }),
    );

  console.info(`Agent 🤖 : ${response.result.text}`);
} catch (error) {
  console.error(FrameworkError.ensure(error).dump());
} finally {
  process.exit(0);
}
