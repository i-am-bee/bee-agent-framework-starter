import "dotenv/config.js";
import { OllamaChatLLM } from "bee-agent-framework/adapters/ollama/chat";
import { Serializer } from "bee-agent-framework";
import fs from "node:fs";
import { BaseMessage } from "bee-agent-framework/llms/primitives/message";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { OllamaLLM } from "bee-agent-framework/adapters/ollama/llm";
import { LLMChatTemplates } from "bee-agent-framework/adapters/shared/llmChatTemplates";

const __dirname = dirname(fileURLToPath(import.meta.url));

const msgs = Serializer.deserialize(
  await fs.promises.readFile(`${__dirname}/msgs.json`, "utf-8"),
) as BaseMessage[];

async function testChat() {
  const llm = new OllamaChatLLM({
    modelId: "llama3.1",
    parameters: {
      temperature: 0,
      num_ctx: 128 * 1024,
    },
  });
  const response = await llm.generate(msgs);
  console.info("CHAT", { response: response.getTextContent() });
}

async function testNonChat() {
  const llm = new OllamaLLM({
    modelId: "llama3.1",
    parameters: {
      temperature: 0,
      num_ctx: 128 * 1024,
    },
  });

  const { template, messagesToPrompt } = LLMChatTemplates.get("llama3.1");
  const prompt = messagesToPrompt(template)(msgs);
  const response = await llm.generate(prompt);
  console.info("DIRECT", { response: response.getTextContent() });
}

await testChat();
await testNonChat();
