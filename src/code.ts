import "dotenv/config.js";
import { BeeAgent } from "bee-agent-framework/agents/bee/agent";
import { UnconstrainedMemory } from "bee-agent-framework/memory/unconstrainedMemory";
import { OllamaChatLLM } from "bee-agent-framework/adapters/ollama/chat";
import { PythonTool } from "bee-agent-framework/tools/python/python";
import { LocalPythonStorage } from "bee-agent-framework/tools/python/storage";
import { Serializer } from "bee-agent-framework";
import fs from "node:fs";

const llm = new OllamaChatLLM();

const agent = new BeeAgent({
  llm,
  memory: new UnconstrainedMemory(),
  tools: [
    new PythonTool({
      codeInterpreter: { url: "http://127.0.0.1:50051" },
      storage: new LocalPythonStorage({
        interpreterWorkingDir: `${process.cwd()}/tmp/code_interpreter_target`,
        localWorkingDir: `${process.cwd()}/tmp/code_interpreter_source`,
      }),
    }),
  ],
});

await agent.run({ prompt: "Write a joke to a joke.txt file." });
console.info("Write done.");

llm.emitter.on("start", async (x) => {
  const output = Serializer.serialize(x.input);
  await fs.promises.writeFile("msgs.json", output);
  //console.info(x.input as BaseMessage[]);
});
const response = await agent.run({ prompt: "Read 'joke.txt' file." }).observe((emitter) => {
  emitter.on("update", (x) => {
    console.info(x);
  });
});
console.info(`Agent: ${response.result.text}`);
