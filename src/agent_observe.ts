import "dotenv/config.js";
import { BeeAgent } from "bee-agent-framework/agents/bee/agent";
import { FrameworkError } from "bee-agent-framework/errors";
import { TokenMemory } from "bee-agent-framework/memory/tokenMemory";
import { DuckDuckGoSearchTool } from "bee-agent-framework/tools/search/duckDuckGoSearch";
import { OpenMeteoTool } from "bee-agent-framework/tools/weather/openMeteo";
import { OllamaChatLLM } from "bee-agent-framework/adapters/ollama/chat";
import * as fs from "node:fs";
import * as process from "node:process";
import { createObserveConnector, ObserveError } from "bee-observe-connector";
import { beeObserveApiSetting } from "./helpers/observe.js";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as path from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const llm = new OllamaChatLLM({
  modelId: "llama3.1",
  parameters: {
    temperature: 0,
    repeat_penalty: 1,
    num_predict: 2000,
  },
});

const agent = new BeeAgent({
  llm,
  memory: new TokenMemory({ llm }),
  tools: [new DuckDuckGoSearchTool(), new OpenMeteoTool()],
});

const getPrompt = () => {
  const fallback = `What is the current weather in Las Vegas?`;
  if (process.stdin.isTTY) {
    return fallback;
  }
  return fs.readFileSync(process.stdin.fd).toString().trim() || fallback;
};

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
    .middleware(
      createObserveConnector({
        api: beeObserveApiSetting,
        cb: async (err, data) => {
          if (err) {
            console.error(`Agent 🤖 : `, ObserveError.ensure(err).explain());
          } else {
            const { id, response } = data?.result || {};
            console.info(`Observe 🔎 : `, response?.text || "Invalid output");

            // you can use `&include_mlflow_tree=true` as well to return all sent data to mlflow
            console.info(
              `Observe 🔎 : Call the Observe API via this curl command outside of this Interactive session and see the trace data in the "trace.json" file: \n\n`,
              `curl -s "${beeObserveApiSetting.baseUrl}/trace/${id}?include_tree=true&include_mlflow=true" \\
\t-H "x-bee-authorization: ${beeObserveApiSetting.apiAuthKey}" \\
\t-H "Content-Type: application/json" \\
\t-o ${path.join(__dirname, "/../tmp/observe/trace.json")}`,
              `\n`,
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
