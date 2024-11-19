import { BeeAgent } from "bee-agent-framework/agents/bee/agent";
import chalk from "chalk";
import "dotenv/config";
import readline from "readline";

async function cliChat(agent: BeeAgent) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("SIGINT", () => {
    console.log("\nGoodbye! 👋");
    rl.close();
    process.exit(0);
  });

  try {
    const userQuestion = await new Promise<string>((resolve) => {
      rl.question("Ask a question: ", (answer) => {
        resolve(answer);
      });
    });

    if (["exit", "q", "quit"].includes(userQuestion.trim().toLowerCase())) {
      console.log("Exiting...");
      rl.close();
      process.exit(0);
    }

    const response = await agent
      .run(
        { prompt: userQuestion.trim() },
        {
          execution: {
            maxRetriesPerStep: 3,
            totalMaxRetries: 10,
            maxIterations: 20,
          },
        },
      )
      .observe((emitter) => {
        emitter.on("update", async ({ update }) => {
          console.log(chalk.gray(`(${update.key}): `, update.value));
        });
      });

    console.log(`🐝: ` + chalk.hex("#9AEDFE")(response.result.text));
    rl.close();
    await cliChat(agent);
  } catch (error) {
    rl.close();
    throw error;
  }
}

export default cliChat;
