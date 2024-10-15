import "dotenv/config.js";
import { BeeAgent } from "bee-agent-framework/agents/bee/agent";
import { FrameworkError } from "bee-agent-framework/errors";
import * as process from "node:process";
import { PythonTool } from "bee-agent-framework/tools/python/python";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { UnconstrainedMemory } from "bee-agent-framework/memory/unconstrainedMemory";
import { LocalPythonStorage } from "bee-agent-framework/tools/python/storage";
import { CustomTool } from "bee-agent-framework/tools/custom";
import { getChatLLM } from "./helpers/llm.js";
import { getPrompt } from "./helpers/prompt.js";

const codeInterpreterUrl = process.env.CODE_INTERPRETER_URL;
if (!codeInterpreterUrl) {
  throw new Error(`The 'CODE_INTERPRETER_URL' environment variable was not set! Terminating.`);
}

const __dirname = dirname(fileURLToPath(import.meta.url));

const agent = new BeeAgent({
  llm: getChatLLM(),
  memory: new UnconstrainedMemory(),
  tools: [
    new PythonTool({
      codeInterpreter: { url: codeInterpreterUrl },
      storage: new LocalPythonStorage({
        interpreterWorkingDir: `${__dirname}/../tmp/code_interpreter_target`,
        localWorkingDir: `${__dirname}/../tmp/code_interpreter_source`,
      }),
    }),
    await CustomTool.fromSourceCode(
      {
        url: codeInterpreterUrl,
      },
      `import requests

def get_riddle() -> dict[str, str] | None:
  """
  Fetches a random riddle from the Riddles API.

  This function retrieves a random riddle and its answer. It does not accept any input parameters.

  Returns:
      dict[str,str] | None: A dictionary containing:
          - 'riddle' (str): The riddle question.
          - 'answer' (str): The answer to the riddle.
      Returns None if the request fails.
  """
  url = 'https://riddles-api.vercel.app/random'
  
  try:
      response = requests.get(url)
      response.raise_for_status() 
      return response.json() 
  except Exception as e:
      return None`,
    ),
  ],
});

try {
  const prompt = getPrompt(`Generate a random riddle.`);
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
