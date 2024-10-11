# bee-agent-framework-starter

## Getting started

1. Clone the repository `git clone git@github.com:i-am-bee/bee-agent-framework-starter`.
2. Install dependencies `npm ci`
3. Create `.env` (from `.env.template`) and fill in missing values (if any).
4. Start the example `npm run start` (it runs the ./src/agent.ts file).

## Using observability

> [!NOTE]
>
> Docker distribution with support for compose is required, the following are supported:
>
> - [Docker](https://www.docker.com/)
> - [Rancher](https://www.rancher.com/) - macOS users may want to use VZ instead of QEMU

Get full visibility of the agent's inner working via our observability stack.

- The [MLFlow](https://mlflow.org/) is used as UI for observability.
- The [Bee Observe](https://github.com/i-am-bee/bee-observe) is the main Open-source observability service for Bee Agent Framework.
- The [Bee Observe Connector](https://github.com/i-am-bee/bee-observe-connector) is the observability connector for Bee Agent Framework

### Steps

1. Start all services related to Observe `npm run infra:start-observe`
2. Start the agent using the observe and MLFlow `npm run start:observe` (it runs ./src/agent_observe.ts file). The output of the `curl` command is saved in the **./tmp/observe/trace.json** file
