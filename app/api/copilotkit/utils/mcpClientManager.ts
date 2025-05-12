import { Client as McpClient } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import fs from 'fs';
import path from 'path';

// TODO: Consider refactoring config loading into its own utility if used in many places
let config: any;
try {
  const configPath = path.join(process.cwd(), 'mcp.config.json');
  const configFile = fs.readFileSync(configPath, 'utf-8');
  config = JSON.parse(configFile);
} catch (error) {
  console.error(
    '(mcpClientManager) Error loading or parsing mcp.config.json:',
    error
  );
  config = { llm: {}, mcpServers: {} }; // Basic fallback
}

// Manages active MCP client connections
const mcpClients: Map<string, McpClient> = new Map();
let clientCounter = 0; // Simple counter for unique client names

/**
 * Gets or creates an MCP client connection for a given server configuration.
 * Uses StdioClientTransport based on settings in mcp.config.json.
 * @param serverName The key from mcp.config.json["mcpServers"]
 * @returns A connected McpClient instance
 */
export async function getMcpClient(serverName: string): Promise<McpClient> {
  // Reuse existing client if available
  if (mcpClients.has(serverName)) {
    // TODO: Add health check for existing client connection?
    console.log(
      `(mcpClientManager) Reusing existing MCP client for [${serverName}]`
    );
    return mcpClients.get(serverName)!;
  }

  // Create new client
  console.log(`(mcpClientManager) Creating new MCP client for [${serverName}]`);
  const serverConfig = config.mcpServers?.[serverName];
  if (!serverConfig) {
    throw new Error(
      `(mcpClientManager) MCP Server configuration not found for: ${serverName}`
    );
  }

  // Resolve relative paths for Python script arguments if needed
  const resolvedArgs = (serverConfig.args || []).map((arg: string) => {
    if (
      (serverConfig.command === 'python' || serverConfig.command === 'py') &&
      arg.startsWith('./') &&
      (arg.endsWith('.py') || arg.endsWith('.js'))
    ) {
      const potentialPath = path.resolve(process.cwd(), arg);
      if (fs.existsSync(potentialPath)) {
        console.log(
          `(mcpClientManager) Resolved relative path: ${arg} -> ${potentialPath}`
        );
        return potentialPath;
      } else {
        // Warn but proceed with original arg if resolved path doesn't exist
        console.warn(
          `(mcpClientManager) Relative path ${arg} specified but not found at ${potentialPath}, using original.`
        );
      }
    }
    return arg;
  });

  const transport = new StdioClientTransport({
    command: serverConfig.command,
    args: resolvedArgs,
    env: { ...process.env, ...(serverConfig.env || {}) }, // Merge environment variables
  });

  const clientInstance = new McpClient({
    name: `copilotkit-client-${serverName}-${++clientCounter}`,
    version: '1.0.0', // TODO: Get from package.json?
  });

  try {
    await clientInstance.connect(transport);
    console.log(
      `(mcpClientManager) MCP Client connected successfully for [${serverName}]`
    );

    // Set up listeners to clean up the client map on error/close
    transport.onerror = (err) => {
      console.error(
        `(mcpClientManager) MCP Transport error for [${serverName}]:`,
        err
      );
      mcpClients.delete(serverName);
    };
    transport.onclose = () => {
      console.log(
        `(mcpClientManager) MCP Transport closed for [${serverName}]`
      );
      mcpClients.delete(serverName);
    };

    mcpClients.set(serverName, clientInstance);
    return clientInstance;
  } catch (error) {
    console.error(
      `(mcpClientManager) Failed to connect MCP client for [${serverName}]:`,
      error
    );
    // Attempt to clean up the failed client instance
    try {
      await clientInstance.close();
    } catch (closeError) {
      console.error(
        '(mcpClientManager) Error during client close after connection failure:',
        closeError
      );
    }
    throw new Error(
      `(mcpClientManager) Failed to connect to MCP server [${serverName}]: ${error}`
    );
  }
}

// Optional: Add process signal listeners (e.g., SIGINT, SIGTERM) here
// to gracefully close all clients in mcpClients map on server shutdown.
