import { getMcpClient } from './mcpClientManager';

// interface McpServiceResponse {
//   success: boolean;
//   details?: any; // Can be any structure from the tool
//   error?: string;
//   rawError?: any; // To store the original error object if needed
// }

/**
 * Calls an MCP tool and returns a single string containing the result or error description.
 * Handles common errors and logging.
 * Intended to provide a usable string result directly to LangChain/CopilotKit.
 *
 * @param serverName The name of the MCP server (from mcp.config.json).
 * @param toolName The name of the tool to call.
 * @param args The arguments for the tool.
 * @returns A promise that resolves to a descriptive string result or error message.
 */
export async function callMcpTool(
  serverName: string,
  toolName: string,
  args: any
): Promise<string> {
  console.log(
    `(McpInteractionService) Calling [${serverName}/${toolName}] with args:`,
    args
  );
  try {
    const client = await getMcpClient(serverName);
    const result = await client.callTool({
      name: toolName,
      arguments: args,
    });

    console.log(
      `(McpInteractionService) Raw result from [${serverName}/${toolName}]:`,
      JSON.stringify(result, null, 2)
    );

    if (result.isError) {
      console.error(
        `(McpInteractionService) MCP Client reported error for [${serverName}/${toolName}]:`,
        result.content
      );
      // Return a simple error string for LangChain
      const errorDetails =
        typeof result.content === 'string'
          ? result.content
          : JSON.stringify(result.content);
      return `Error from ${toolName}: ${errorDetails}`;
    }

    // Process successful content into a single descriptive string for LangChain
    let processedContentString = '';
    if (Array.isArray(result.content)) {
      result.content.forEach((item: any, index: number) => {
        if (item && typeof item === 'object' && typeof item.text === 'string') {
          // Attempt to parse if it looks like JSON, otherwise use the text directly
          try {
            const parsedText = JSON.parse(item.text);
            // If parsedText is an object and has an agent-level error message
            if (
              parsedText &&
              typeof parsedText === 'object' &&
              parsedText.error
            ) {
              processedContentString += `Item ${index} Error: ${
                parsedText.error
              }. Details: ${JSON.stringify(
                parsedText.details || parsedText
              )}; `;
            } else {
              processedContentString += `${JSON.stringify(parsedText)}; `;
            }
          } catch (e) {
            processedContentString += `${item.text}; `;
          }
        } else if (typeof item === 'string') {
          processedContentString += `${item}; `;
        } else {
          processedContentString += `${JSON.stringify(item)}; `;
        }
      });
    } else if (typeof result.content === 'string') {
      processedContentString = result.content;
    } else {
      processedContentString = JSON.stringify(result.content);
    }

    // Trim trailing semicolon and space
    processedContentString = processedContentString
      .trim()
      .replace(/;$/, '')
      .trim();

    if (!processedContentString) {
      // Fallback if processing resulted in an empty string, which might cause issues
      console.warn(
        `(McpInteractionService) Processed content for [${serverName}/${toolName}] is empty. Falling back to stringified raw content.`
      );
      return (
        JSON.stringify(result.content) ||
        'Tool executed, but returned no specific content.'
      );
    }

    console.log(
      `(McpInteractionService) Processed string for LangChain from [${serverName}/${toolName}]:`,
      processedContentString
    );
    return processedContentString;
  } catch (error: unknown) {
    console.error(
      `(McpInteractionService) Error calling MCP tool [${serverName}/${toolName}]:`,
      error
    );
    const errorMessage = error instanceof Error ? error.message : String(error);
    // Return a simple error string for LangChain
    return `Failed to execute ${toolName} on ${serverName}: ${errorMessage}`;
  }
}
