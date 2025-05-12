# Open MCP Client - Bedrock & Agents PoC

![UI Screenshot](https://github.com/user-attachments/assets/364b6705-14d4-4e6d-bea7-fb9f12664fab)

This project is a Proof of Concept (PoC) demonstrating a chat interface powered by AWS Bedrock (Claude 3 Sonnet) that can delegate tasks to specialized backend agents using the Model Context Protocol (MCP).

Currently, it integrates two MCP agents:

1.  **AWS Documentation Agent:** Allows searching, reading, and getting recommendations for AWS documentation.
2.  **PowerPoint Agent:** Allows creating, opening, modifying (adding slides, text, shapes, charts), and saving PowerPoint (.pptx) files. (Note: Does _not_ currently extract existing text content).

## Architecture

- `/app`: Next.js application
  - Frontend: Chat UI built with `@copilotkit/react-ui` and MUI.
  - Backend API (`/app/api/copilotkit/route.ts`):
    - Orchestrates interaction with AWS Bedrock (Claude 3).
    - Manages and communicates with MCP agents using `@modelcontextprotocol/sdk`.
    - Launches Python-based MCP servers via Node.js `child_process`.
- `/agent`: Contains the Python MCP server implementations.
  - `office-powerpoint-mcp-server`: Handles PowerPoint operations.
  - (AWS Documentation agent is installed/run via `uvx` on demand, not stored here).
- `/data/pptx`: Sample PowerPoint files for testing.
- `mcp.config.json`: Central configuration file for LLM and MCP server settings.

## Prerequisites

1.  **Node.js:** v18 or later.
2.  **pnpm:** Package manager for Node.js. Install via `npm install -g pnpm` or other methods (see [pnpm installation](https://pnpm.io/installation)).
3.  **Python:** 3.10 or higher (for the PowerPoint agent).
4.  **pip:** Python package installer (usually comes with Python).
5.  **uv:** Python package installer/resolver (used by `uvx`). Install via `pip install uv` or other methods (see [uv documentation](https://github.com/astral-sh/uv)).
6.  **AWS Account & Credentials:**
    - An AWS account with access to Bedrock.
    - Ensure your AWS credentials (Access Key ID, Secret Access Key) are configured in a way that the AWS SDK for JavaScript v3 can find them. Common methods include:
      - Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`).
      - Shared credential file (`~/.aws/credentials`).
      - IAM role attached to an EC2 instance or ECS task.
      - **Note:** You can also directly put credentials in `mcp.config.json` (see Configuration section), but this is **not recommended for production or shared environments**.

## Setup

1.  **Clone the Repository:**

    ```bash
    git clone <repository_url>
    cd open-mcp-client-main
    ```

2.  **Install Node.js Dependencies:**

    ```bash
    pnpm install
    ```

    This installs dependencies for the Next.js app (`/app`).

3.  **Install Python Dependencies for PowerPoint Agent:**
    The PowerPoint agent has its own dependencies managed via `requirements.txt`.

    ```bash
    # Ensure you are in the project root directory
    pip install -r ./agent/office-powerpoint-mcp-server/requirements.txt
    ```

    _(Alternatively, if you prefer isolated environments, create a virtual environment first: `python -m venv .venv && source .venv/bin/activate` (or `.\venv\Scripts\activate` on Windows) before running `pip install`)_

4.  **Configure `mcp.config.json`:**
    A template file `mcp.config.example.json` might exist, or you can create `mcp.config.json` at the project root. Populate it with your specific settings:

    ```json
    {
      "systemPrompt": "You are a helpful assistant. You have access to tools for searching AWS documentation and manipulating PowerPoint files. Use the tools when appropriate. For PowerPoint tasks, you need to open or create a presentation first to get an ID, then use that ID for subsequent operations like adding slides or saving. For file paths, use relative paths like './data/pptx/test.pptx' or './output/new_file.pptx'.",
      "llm": {
        "provider": "bedrock",
        "model": "anthropic.claude-3-sonnet-20240229-v1:0", // Or your preferred Claude 3 model
        "region": "YOUR_AWS_REGION", // e.g., "us-east-1"
        "aws_access_key_id": "YOUR_AWS_ACCESS_KEY_ID", // Optional: Only if not configured elsewhere (NOT RECOMMENDED)
        "aws_secret_access_key": "YOUR_AWS_SECRET_ACCESS_KEY", // Optional: Only if not configured elsewhere (NOT RECOMMENDED)
        "temperature": 0.1
      },
      "mcpServers": {
        "aws-documentation": {
          "command": "uvx",
          "args": [
            "--from",
            "awslabs-aws-documentation-mcp-server", // Ensure this package name is correct
            "awslabs.aws-documentation-mcp-server" // Ensure this executable name is correct
            // Add '.exe' on Windows if needed: "awslabs.aws-documentation-mcp-server.exe"
          ],
          "env": {
            "FASTMCP_LOG_LEVEL": "INFO" // Or "ERROR" for less verbose logs
          }
        },
        "powerpoint": {
          "command": "python",
          "args": ["./agent/office-powerpoint-mcp-server/ppt_mcp_server.py"],
          "env": {
            "FASTMCP_LOG_LEVEL": "INFO" // Or "ERROR"
          }
        }
      }
    }
    ```

    **Important:**

    - Replace `YOUR_AWS_REGION` with the AWS region where you have Bedrock access (e.g., `us-east-1`, `ap-southeast-2`).
    - Fill in `model` with the correct Bedrock model ID you intend to use.
    - **Credentials:** It's best practice to configure AWS credentials using environment variables or shared files recognized by the AWS SDK, rather than hardcoding them in this file. If credentials are not in the config, the SDK will attempt to find them automatically.
    - **`uvx` paths:** Double-check the package name (`awslabs-aws-documentation-mcp-server`) and the executable name (`awslabs.aws-documentation-mcp-server` or potentially with `.exe` on Windows) for the AWS documentation agent, as these might change. Verify by trying to run `uvx --from awslabs-aws-documentation-mcp-server awslabs.aws-documentation-mcp-server --help` in your terminal.

## Running the Application

1.  **Start the Development Server:**
    From the project root directory:

    ```bash
    pnpm run dev
    ```

    This command concurrently starts:

    - The Next.js application (frontend UI and backend API).
    - It will _automatically_ launch the Python MCP servers (`aws-documentation` via `uvx`, `powerpoint` via `python`) as defined in `mcp.config.json` when the backend API first needs to communicate with them.

2.  **Open the Application:**
    Navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

You should now see the chat interface. You can try interacting with the assistant using prompts like:

- "Search the AWS docs for EC2 instance types"
- "Create a new presentation"
- "Open the presentation ./data/pptx/test.pptx"
- (After opening/creating) "Add a title slide with the title 'My Demo'"
- (After opening/creating) "Save the presentation to ./output/demo_save.pptx"

## Troubleshooting

- **AWS Credentials Error:** Ensure your AWS credentials are correctly configured and accessible to the application (environment variables, `~/.aws/credentials`, or IAM role). Check that the region in `mcp.config.json` is correct and has Bedrock model access enabled.
- **MCP Agent Connection Error:**
  - Check the console output where you ran `pnpm run dev` for errors related to `child_process` or the specific agent (`aws-documentation` or `powerpoint`).
  - Verify the `command` and `args` in `mcp.config.json` are correct for your system (Python path, `uvx` executable names potentially needing `.exe` on Windows).
  - Ensure Python dependencies (`requirements.txt`) for the PowerPoint agent were installed correctly.
  - Make sure `uv` and `uvx` are installed and accessible in your PATH.
- **`uvx` "program not found":** Double-check the `--from <package_name>` and `<executable_name>` in `mcp.config.json`. Try running the `uvx` command directly in your terminal to see if it works. Clear the `uv` cache (`uv cache clean`) if needed.

## License

Distributed under the MIT License. See `LICENSE` file for more information.
