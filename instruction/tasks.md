# Goal

To set up an LLM (Claude on AWS Bedrock) that can be interacted with via a UI, and can dynamically delegate tasks to at least two distinct MCP agents: one for querying a SQLite database and another for extracting information from PowerPoint files. The PoC should demonstrate the LLM's ability to choose the correct agent and use the agent's output to respond to user queries.

---

**Phase 1: Understanding the Example Codebase & Core Concepts**

This is the absolute first step. I need to thoroughly understand your provided example.

**1.1. Analysis of Existing Code - Key Questions to Answer:**

*   **LLM Connection:**
    *   How does the current UI/backend connect to the LLM? (e.g., direct API calls, a specific SDK, an intermediary orchestration layer like a Lambda function).
    *   What LLM is it currently configured for (if any)? What parameters are used for invocation?
    *   How is authentication/authorization handled for LLM access?
    *   How is conversational context/history managed and passed to the LLM?
*   **MCP Server/Agent Configuration & Interaction (Crucial):**
    *   **Definition of "MCP Server" in the example:** Is it a single server that routes to different agents, or does "MCP Server" refer to the individual agents themselves?
    *   **Agent Discovery/Registration:** How does the LLM/orchestrator know what MCP agents are available and what their capabilities are? (e.g., hardcoded, a configuration file, a dynamic registry).
    *   **Agent Invocation Protocol:**
        *   How does the LLM signal its intent to use a specific MCP agent? (e.g., specific formatted text in its output, function calling mechanism if the LLM supports it, predefined keywords).
        *   What data format is used to send requests to an MCP agent? (e.g., JSON, specific parameters).
        *   What data format does an MCP agent return?
    *   **Data Flow:** Trace how a user query flows from UI -> LLM -> MCP Agent -> LLM -> UI.
    *   **MCP Agent Implementation (Conceptual):** Even if the example doesn't have SQLite/PowerPoint agents, how are generic agents structured? (e.g., standalone processes, Lambda functions, classes within a larger application).
    *   **Configuration of MCP Agents:** How are individual agents (or the "MCP Server" routing to them) configured? (e.g., connection strings for databases, paths to files, API keys for external services).
*   **UI Interaction:**
    *   How does the UI present the interaction? (e.g., chat interface).
    *   Does the UI provide any way to *see* or *debug* the MCP agent interaction? (This would be useful).
*   **Orchestration Logic:**
    *   Is there a central orchestrator (e.g., a main backend script, a Lambda function) that manages the calls between the UI, LLM, and MCP agents?
    *   How does this orchestrator handle the multi-step process (LLM asks for tool, orchestrator calls tool, orchestrator sends tool result back to LLM)?

**1.2. Deliverable of Analysis Phase:**

*   A document summarizing the architecture of the example codebase.
*   Clear explanation of the existing LLM connection mechanism.
*   Detailed breakdown of how MCP agents are defined, configured, invoked, and how they return data in the example.
*   Identification of patterns or components that can be reused or adapted for the new SQLite and PowerPoint agents.

---

**Phase 2: Planning the Implementation for New Requirements**

Based on the understanding from Phase 1 and the new requirements.

**2.1. Design Decisions:**

*   **LLM:** Claude 3 Sonnet on AWS Bedrock (confirm specific model variant if needed, e.g., Haiku, Sonnet, Opus - Sonnet is a good balance).
*   **MCP Agent Architecture:**
    *   Will each MCP agent be a separate microservice/Lambda function, or will they be modules within a single "MCP Server" application? (Separate Lambdas are often good for scalability and clear separation of concerns).
    *   How will the orchestrator (which might be part of the main backend or a dedicated Lambda) communicate with these agents? (e.g., synchronous HTTP calls, asynchronous messaging – synchronous is simpler for a PoC).
*   **LLM-to-Agent Invocation Strategy (Tool Use/Function Calling):**
    *   We need to define how Claude will be prompted to request the use of either the "SQLiteAgent" or "PowerPointAgent."
    *   This involves crafting a good **system prompt** for Claude that describes these "tools," what they do, and importantly, *how Claude should format its request to use them*.
    *   Example Claude output format for tool use:
        ```json
        {
          "tool_use": {
            "tool_name": "SQLiteAgent_query", // or "PowerPointAgent_extract_text"
            "tool_input": {
              // Specific inputs for each agent
              // For SQLite: "query": "SELECT * FROM users WHERE country='NZ';"
              // For PowerPoint: "file_path": "s3://bucket/path/to/presentation.pptx", "slide_number": 5 (optional)
            }
          }
        }
        ```
*   **Data Handling:**
    *   **SQLite Agent:** How will it get the database file? (e.g., path to a local .db file for PoC, or connection to a provisioned SQLite DB if on a persistent service).
    *   **PowerPoint Agent:** How will it access .pptx files? (e.g., local file path, S3 URI). What kind of information will it extract? (e.g., all text, text from specific slides, speaker notes).
*   **UI Updates (Minimal if leveraging existing chat UI):**
    *   Ensure the UI can send queries that would logically require these new agents.
    *   Potentially add a way for the user to specify (or the system to infer) which data source might be relevant if not obvious from the query.

**2.2. Phased Implementation Plan:**

**(Pre-requisite: AWS Account Setup, Bedrock Model Access for Claude enabled, IAM roles configured)**

**Sprint 1: Core LLM & Orchestrator Setup, SQLite Agent (Part 1)**

1.  **Task 1.1: Setup Claude on Bedrock & Basic Invocation:**
    *   Modify the existing LLM connection logic (from example code or new) to invoke Claude 3 Sonnet on Bedrock.
    *   Create a simple test script/Lambda to send a prompt to Claude and get a response.
    *   Define basic IAM role for Lambda to access Bedrock.
2.  **Task 1.2: Design Orchestrator Logic for Tool Use:**
    *   Adapt/create the orchestrator component.
    *   Implement the logic to:
        *   Send an initial prompt (with system prompt defining tools) to Claude.
        *   Parse Claude's response to detect the `tool_use` JSON structure.
        *   (Initially) Log the detected tool name and input.
3.  **Task 1.3: SQLite Agent - Basic Implementation (Local DB Query):**
    *   Create the `SQLiteAgent` (e.g., as a Python script or Lambda function).
    *   It should accept a SQL query string as input.
    *   It should connect to a *predefined, local* SQLite database file (e.g., `sample.db` included in the PoC).
    *   Execute the query and return the results (e.g., as a list of dictionaries or JSON string).
    *   Basic error handling (e.g., SQL syntax error).

**Sprint 2: SQLite Agent Integration & UI Test**

1.  **Task 2.1: Integrate SQLite Agent with Orchestrator:**
    *   Modify the orchestrator: when it detects `tool_name: "SQLiteAgent_query"`, it calls the `SQLiteAgent` with the `query` from `tool_input`.
    *   The orchestrator takes the result from `SQLiteAgent`.
    *   The orchestrator then constructs a new prompt for Claude, including the original context and the data returned from the SQLite agent (e.g., "Here is the result from the SQLite query: [data]. Now please answer the user's original question.").
    *   Claude generates the final response.
2.  **Task 2.2: UI Interaction for SQLite Queries:**
    *   Ensure the existing UI can send a query to the backend that would naturally lead to a SQLite database lookup (e.g., "Find all customers in New Zealand from the database.").
    *   The UI should display Claude's final, data-informed response.
3.  **Task 2.3: End-to-End Test (SQLite):**
    *   Test the full flow: User query -> UI -> Orchestrator -> Claude (requests tool) -> Orchestrator -> SQLiteAgent -> Orchestrator -> Claude (uses data) -> Orchestrator -> UI.

**Sprint 3: PowerPoint Agent Implementation & Integration**

1.  **Task 3.1: PowerPoint Agent - Basic Implementation (Local File Text Extraction):**
    *   Create the `PowerPointAgent` (e.g., Python script/Lambda using `python-pptx` library).
    *   It should accept a file path to a .pptx file and optionally slide numbers/keywords as input.
    *   It should extract text from the specified slides (or all slides if none specified).
    *   Return the extracted text (e.g., as a single string or structured per slide).
    *   Basic error handling (e.g., file not found, not a .pptx).
    *   For PoC, assume .pptx files are locally accessible to the agent or in a predefined S3 location.
2.  **Task 3.2: Integrate PowerPoint Agent with Orchestrator:**
    *   Update the orchestrator: when it detects `tool_name: "PowerPointAgent_extract_text"`, it calls the `PowerPointAgent`.
    *   Similar flow as SQLite agent for providing results back to Claude.
3.  **Task 3.3: Update System Prompt for Claude:**
    *   Add the `PowerPointAgent` and its usage instructions to Claude's system prompt.
4.  **Task 3.4: UI Interaction for PowerPoint Queries:**
    *   User query like: "Summarize the key points from the Q3 marketing presentation.pptx on slide 5."
5.  **Task 3.5: End-to-End Test (PowerPoint):**
    *   Test the full flow for PowerPoint extraction.

**Sprint 4: Refinement, Testing Both Agents, Documentation**

1.  **Task 4.1: Testing with Varied Queries:**
    *   Test scenarios where Claude might need to choose between agents or ask clarifying questions.
    *   Test error handling for both agents and the orchestrator.
2.  **Task 4.2: Code Cleanup & Refactoring:**
    *   Improve modularity, add comments.
3.  **Task 4.3: Documentation:**
    *   How to set up the environment.
    *   How to configure/run the orchestrator and agents.
    *   Example queries for each agent.
    *   Architectural overview.
4.  **Task 4.4: PoC Demo Preparation.**

---

**2.3. Configuration of MCP Agents:**

*   **SQLite Agent:**
    *   Path to the SQLite database file (can be an environment variable or config file).
*   **PowerPoint Agent:**
    *   Base path for PowerPoint files (if local) or S3 bucket/prefix details (if using S3).
*   **Orchestrator:**
    *   Endpoints/invocation details for each MCP agent (if they are separate services/Lambdas).
    *   Bedrock region and Claude model ID.

---
