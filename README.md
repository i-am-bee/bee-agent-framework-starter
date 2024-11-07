# 🐝 Bee Agent Framework Starter

This starter template lets you quickly start working with the [Bee Agent Framework](https://github.com/i-am-bee/bee-agent-framework) in a second.

📚 See the [documentation](https://i-am-bee.github.io/bee-agent-framework/) to learn more.

## ✨ Key Features

- 🔒 Safely execute an arbitrary Python Code via [Bee Code Interpreter](https://github.com/i-am-bee/bee-code-interpreter).
- 🔎 Get complete visibility into agents' decisions using our MLFlow integration thanks to [Bee Observe](https://github.com/i-am-bee/bee-observe).
- 🚀 Fully fledged TypeScript project setup with linting and formatting.

## 📦 Requirements

- JavaScript runtime [NodeJS > 18](https://nodejs.org/) (ideally installed via [nvm](https://github.com/nvm-sh/nvm)).
- Container system like [Rancher Desktop](https://rancherdesktop.io/), [Podman](https://podman.io/) (VM must be rootfull machine) or [Docker](https://www.docker.com/).
- LLM Provider either external [WatsonX](https://www.ibm.com/watsonx) (OpenAI, Groq, ...) or local [ollama](https://ollama.com).

## 🛠️ Getting started

1. Clone this repository or [use it as a template](https://github.com/new?template_name=bee-agent-framework-starter&template_owner=i-am-bee).
2. Install dependencies `npm ci`.
3. Configure your project by filling in missing values in the `.env` file (default LLM provider is locally hosted `Ollama`).
4. Run the agent `npm run start src/agent.ts`

To run an agent with a custom prompt, simply do this `npm run start src/agent.ts <<< 'Hello Bee!'`

🧪 More examples can be found [here](https://github.com/i-am-bee/bee-agent-framework/blob/main/examples).

> [!TIP]
>
> To use Bee agent with [Python Code Interpreter](https://github.com/i-am-bee/bee-code-interpreter) refer to the [Code Interpreter](#code-interpreter) section.

> [!TIP]
>
> To use Bee agent with [Bee Observe](https://github.com/i-am-bee/bee-observe) refer to the [Observability](#observability) section.

## 🏗 Infrastructure

> [!NOTE]
>
> Docker distribution with support for _compose_ is required, the following are supported:
>
> - [Docker](https://www.docker.com/)
> - [Rancher](https://www.rancher.com/) - macOS users may want to use VZ instead of QEMU
> - [Podman](https://podman.io/) - requires [compose](https://podman-desktop.io/docs/compose/setting-up-compose) and **rootful machine** (if your current machine is rootless, please create a new one, also ensure you have enabled Docker compatibility mode).

## 🔒Code interpreter

The [Bee Code Interpreter](https://github.com/i-am-bee/bee-code-interpreter) is a gRPC service that an agent uses to execute an arbitrary Python code safely.

### Instructions

1. Start all services related to the [`Code Interpreter`](https://github.com/i-am-bee/bee-code-interpreter) `npm run infra:start --profile=code_interpreter`
2. Run the agent `npm run start src/agent_code_interpreter.ts`

> [!NOTE]
>
> Code Interpreter runs on `http://127.0.0.1:50051`.

## 🔎 Observability

Get complete visibility of the agent's inner workings via our observability stack.

- The [MLFlow](https://mlflow.org/) is used as UI for observability.
- The [Bee Observe](https://github.com/i-am-bee/bee-observe) is the observability service (API) for gathering traces from [Bee Agent Framework](https://github.com/i-am-bee/bee-agent-framework).
- The [Bee Observe Connector](https://github.com/i-am-bee/bee-observe-connector) is the observability connector that sends traces from [Bee Agent Framework](https://github.com/i-am-bee/bee-agent-framework) to [Bee Observe](https://github.com/i-am-bee/bee-observe).

### Instructions

1. Start all services related to [Bee Observe](https://github.com/i-am-bee/bee-observe) `npm run infra:start --profile=observe`
2. Run the agent `npm run start src/agent_observe.ts`
3. See visualized trace in MLFlow web application [`http://127.0.0.1:8080/#/experiments/0`](http://localhost:8080/#/experiments/0)

> [!TIP]
>
> Configuration file is [infra/observe/.env.docker](./infra/observe/.env.docker).
