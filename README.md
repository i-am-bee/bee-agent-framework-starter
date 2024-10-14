# Bee Agent Framework Starter

This starter template allows you to easily start working with the [Bee Agent Framework](https://github.com/i-am-bee/bee-agent-framework) in a second.

## Key Features

- ✨ Safely execute an arbitrary Python Code via [Bee Code Interpreter](https://github.com/i-am-bee/bee-code-interpreter).
- ✨ Get complete visibility into agents’ decisions using our MLFlow integration thanks to [Bee Observe](https://github.com/i-am-bee/bee-observe).
- ✨ Fully fledged TypeScript project setup with linting and formatting.

## Getting started

1. Clone the repository `git clone git@github.com:i-am-bee/bee-agent-framework-starter` or create your own repository from this one.
2. Install dependencies `npm ci`.
3. Fill missing values in `.env`.
4. Run the agent `npm run start` (it runs the `./src/agent.ts` file).

## Infrastructure

> [!NOTE]
>
> Docker distribution with support for compose is required, the following are supported:
>
> - [Docker](https://www.docker.com/)
> - [Rancher](https://www.rancher.com/) - macOS users may want to use VZ instead of QEMU
> - [Podman](https://podman.io/) - requires [compose](https://podman-desktop.io/docs/compose/setting-up-compose) and **rootful machine** (if your current machine is rootless, please create a new one)

## Code interpreter

### Instructions

1. Start all services related to Code Interpreter `npm run infra:start --profile=code_interpreter`
2. Add `CODE_INTERPRETER_URL=http://127.0.0.1:50051` to your `.env` (if `.env` does not exist, create one from `.env.template`).
3. Run the agent `npm run start:code_interpreter` (it runs the `./src/agent_code_interpreter.ts` file)

## Observability

Get full visibility of the agent's inner working via our observability stack.

- The [MLFlow](https://mlflow.org/) is used as UI for observability.
- The [Bee Observe](https://github.com/i-am-bee/bee-observe) is the main Open-source observability service for Bee Agent Framework.
- The [Bee Observe Connector](https://github.com/i-am-bee/bee-observe-connector) is the observability connector for Bee Agent Framework

Configuration (ENV variables) can be found [here](./infra/observe/.env.docker).

### Instructions

1. Start all services related to Observe `npm run infra:start --profile=observe`
2. Start the agent using the observe and MLFlow `npm run start:observe` (it runs the `./src/agent_observe.ts` file).
3. Run the `curl` command that retrieves data from Bee Observe and passes them to the `MLFlow` instance.
4. Access MLFlow web application [`http://localhost:8080/#/experiments/`](http://localhost:8080/#/experiments/)
   - Credentials: (user: `admin`, password: `password`)
