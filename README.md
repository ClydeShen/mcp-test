# MCP Client - Bedrock & Agents PoC

This project demonstrates a chat interface powered by AWS Bedrock (Claude 3 Sonnet) that delegates tasks to specialized MCP agents.

**Integrated Agents:**

- **AWS Documentation Agent:** Search, read, and get recommendations for AWS docs.
- **PowerPoint Agent:** Create, open, modify, and save PowerPoint (.pptx) files.
- **Word Agent:** Create, read, and manipulate Microsoft Word documents.

## Architecture

- `/app`: Next.js application (Frontend: CopilotKit UI + MUI; Backend API: Orchestrates LLM and MCP agents).
- `mcp.config.json`: Central configuration for LLM (Bedrock) and MCP server settings.
- MCP agents are typically run via `uvx` as defined in `mcp.config.json`.

## Prerequisites

- **Node.js:** v18+
- **pnpm:** Node.js package manager.
- **uv:** Python package utility (for `uvx`). Install via `pip install uv`.
- **AWS Account & Credentials:** For Bedrock access. Configure via environment variables, shared credential file, or IAM role (preferred over hardcoding in `mcp.config.json`).

## Setup

1.  **Clone Repository:**

    ```bash
    git clone <repository_url>
    cd open-mcp-client-main
    ```

2.  **Install Node.js Dependencies:**

    ```bash
    pnpm install
    ```

3.  **Configure `mcp.config.json`:**
    Create `mcp.config.json` at the project root (can copy from `mcp.config.example.json` if provided). Key settings:
    - `systemPrompt`: Describes available tools to the LLM.
    - `llm`: Bedrock model ID, region, and optionally credentials (not recommended).
    - `mcpServers`: Defines each MCP agent, its command (e.g., `uvx`), arguments, and environment variables. Example:
      ```json
      "mcpServers": {
        "agent-name": {
          "command": "uvx",
          "args": ["--from", "published-package-name", "executable_name"],
          "env": { "FASTMCP_LOG_LEVEL": "INFO" }
        }
        // ... other agents
      }
      ```
      Ensure AWS region is correct and `uvx` package/executable names are accurate.

## Running the Application

1.  **Start Development Server:**

    ```bash
    pnpm run dev
    ```

    The Next.js app and MCP servers (launched on demand) will start.

2.  **Open in Browser:** [http://localhost:3000](http://localhost:3000)

**Example Prompts:**

- "Search AWS docs for EC2 instance types"
- "Create a new PowerPoint presentation"
- "Create a Word document named report.docx and add a title 'Q3 Report'"

## Troubleshooting

- **AWS Credentials:** Verify configuration, region, and Bedrock access.
- **MCP Agent Connection:** Check console for errors. Confirm `command` and `args` in `mcp.config.json` (especially `uvx` names, add `.exe` on Windows if needed). Ensure `uvx` is in PATH.
- **`uvx` Issues:** Try `uvx` command directly. Clear `uv` cache: `uv cache clean`.

## Adding a New MCP Agent

1.  **Update `mcp.config.json`:**

    - Add a new entry to `mcpServers` for your agent (typically using `uvx`).
    - Update `systemPrompt` to inform the LLM of the new agent's capabilities.

    ```jsonc
    // Example for a new 'my-new-agent'
    "mcpServers": {
      // ... existing agents ...
      "my-new-agent": {
        "command": "uvx",
        "args": ["--from", "my-published-package", "my_agent_executable"],
        "env": {}
      }
    }
    ```

2.  **Define Agent Actions (`app/api/copilotkit/agents/newAgent.ts`):**
    Create a `newAgent.ts` file. Import `CopilotAction` and `callMcpTool`. Define and export an array of actions for the agent.

    ```typescript
    // app/api/copilotkit/agents/newAgent.ts
    import { type AgentAction } from '../types';
    import { callMcpTool } from '../utils/mcpInteractionService';

    // Define arg interfaces for each action
    interface MyToolArgs {
      /* ... */
    }

    export const newAgentActions: AgentAction[] = [
      {
        name: 'NewAgent_my_tool',
        description: 'Description of my tool.',
        parameters: [
          /* tool parameters */
        ],
        handler: async (args: MyToolArgs) =>
          callMcpTool('my-new-agent', 'actual_tool_name_on_server', args),
      },
      // ... other actions for this agent
    ];
    ```

3.  **Integrate in API Route (`app/api/copilotkit/route.ts`):**
    Import and add your `newAgentActions` to the `allActions` array.

    ```typescript
    // app/api/copilotkit/route.ts
    // ... other imports ...
    import { newAgentActions } from './agents/newAgent'; // <-- Import

    const allActions: any[] = [
      // ... existing actions ...
      ...newAgentActions, // <-- Add
    ];
    // ...
    ```

4.  **Dependencies:** Ensure `uvx` can find and run the new agent. If it requires local files/setup not handled by `uvx`, adjust prerequisites and setup steps accordingly.

## License

Distributed under the MIT License. See `LICENSE` file for more information.
