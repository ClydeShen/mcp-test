# Technical Requirements & Implementation Plan

## Project Requirement

- The project should be easy to demo locally, with demonstrable milestones at the end of each implementation phase.
- The project should be easy to setup and initialise, with clear instructions for each phase.
- The project needs to implement LLM (Claude 3 Sonnet) and MCP as core services

## Monorepo Structure

- `/app`: Next.js app (UI + API)
  - Uses CopilotKit for chat UI and tool call rendering
  - Backend API integrates with LLM (Claude on AWS Bedrock) and MCP agents
- `/agent`: All MCP servers (e.g., Office-PowerPoint-MCP-Server, AWS Documentation MCP Server, future agents)
  - Each agent is a standalone service (Python, Node.js, etc.)
  - PowerPoint and AWS Documentation MCP servers are Python-based, invoked via child_process from `/app`

---

## Core Technical Requirements

- **LLM:** Claude 3 Sonnet on AWS Bedrock (`anthropic.claude-3-5-sonnet-20241022-v2:0`)
- **Frontend:** CopilotKit chat UI and tool call renderer only (no spreadsheet UI, no MCP config UI)
- **Backend:**
  - TypeScript/Node.js (Next.js API route)
  - Implements two MCP agent actions:
    - **AWS Documentation MCP Agent:**
      - Search AWS documentation
      - Read AWS documentation (convert to markdown)
      - Get recommendations for AWS documentation pages
      - Calls the Python server via child_process (using `uvx` or `docker` as per the server's README)
    - **PowerPoint Agent:**
      - Extract text from PowerPoint files (calls Python MCP server via child_process)
  - All agent config (server paths, file locations) via config file or environment variables
- **No spreadsheet features**
- **No UI-based MCP configuration**
- **All configuration is static (file/env)**
- **User can see tool/agent usage in UI**

---

## Implementation Tasks

### Phase 1: Foundation (Completed)

- [x] Analyze existing codebase and architecture
- [x] Understand LLM, MCP agent, and UI integration

### Phase 2: Implementation

#### Sprint 1: LLM & Orchestrator Setup, AWS Documentation MCP Agent

- [ ] **Task 1.1:** Integrate Claude on Bedrock in `/app/api/copilotkit/route.ts` (via LangChain ChatBedrock)
- [ ] **Task 1.2:** Define CopilotKit actions for AWS Documentation MCP and PowerPoint agents
- [ ] **Task 1.3:** Implement AWS Documentation MCP agent (calls Python server via child_process)
- [ ] **Task 1.4:** Remove spreadsheet/sample agent code from UI and backend

#### Sprint 2: UI & AWS Documentation MCP Agent Testing

- [ ] **Task 2.1:** Clean up UI (remove spreadsheet/MCP config components)
- [ ] **Task 2.2:** Ensure chat UI and tool call renderer are functional
- [ ] **Task 2.3:** Test end-to-end AWS Documentation MCP agent flow (UI → API → AWS Documentation MCP agent → API → UI)

#### Sprint 3: PowerPoint Agent Integration

- [ ] **Task 3.1:** Integrate Office-PowerPoint-MCP-Server in `/agent` (Python, install dependencies)
- [ ] **Task 3.2:** Implement PowerPoint agent handler in `/app/api/copilotkit/route.ts` (calls Python MCP server via child_process)
- [ ] **Task 3.3:** Update system prompt to describe both agents/tools to Claude
- [ ] **Task 3.4:** Test end-to-end PowerPoint agent flow (UI → API → Python MCP server → API → UI)

#### Sprint 4: Refinement & Documentation

- [ ] **Task 4.1:** Test with varied queries (agent selection, error handling)
- [ ] **Task 4.2:** Refactor code, add comments, ensure robust error handling
- [ ] **Task 4.3:** Document setup, configuration, and usage (env/config, agent paths, example queries)
- [ ] **Task 4.4:** Prepare PoC demo (demo script, stability check)

---

## Configuration Example

```json
{
  "systemPrompt": "",
  "llm": {
    "provider": "bedrock",
    "model": "anthropic.claude-3-5-sonnet-20241022-v2:0",
    "region": "ap-southeast-2",
    "aws_access_key_id": "",
    "aws_secret_access_key": "",
    "temperature": 0.2
  },
  "mcpServers": {
    "aws-documentation": {
      "command": "uvx",
      "args": ["awslabs.aws-documentation-mcp-server@latest"],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      }
    },
    "powerpoint": {
      "command": "python",
      "args": ["./agent/office-powerpoint-mcp-server/ppt_mcp_server.py"]
    }
  }
}
```

- Set via `mcp.config.json` or environment variables
- AWS Documentation MCP server path: e.g., `agent/aws-documentation-mcp-server` (use `uvx` as per the server's README)
- PowerPoint MCP server path: `agent/office-powerpoint-mcp-server/ppt_mcp_server.py`

---

## LLM Instructions (System Prompt)

- Clearly describe available tools:
  - **AWSDocumentation_read_documentation:** Provide a URL to fetch and convert AWS documentation to markdown
  - **AWSDocumentation_search_documentation:** Provide a search phrase and limit to search AWS docs
  - **AWSDocumentation_recommend:** Provide a URL to get recommendations for AWS docs
  - **PowerPointAgent_extract_text:** Provide a file path and optional slide number to extract text
- No spreadsheet or config UI features
- Always show tool/agent usage in the UI
