import { getMcpClient } from './mcpClientManager';

interface McpServiceResponse {
  success: boolean;
  details?: any; // Can be any structure from the tool
  error?: string;
  rawError?: any; // To store the original error object if needed
}

/**
 * Calls an MCP tool and returns a standardized JSON string response.
 * Handles common errors and logging.
 *
 * @param serverName The name of the MCP server (from mcp.config.json).
 * @param toolName The name of the tool to call.
 * @param args The arguments for the tool.
 * @returns A promise that resolves to a JSON string of McpServiceResponse.
 */
export async function callMcpTool(
  serverName: string,
  toolName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // Check if the MCP client itself indicated an error
    if (result.isError) {
      console.error(
        `(McpInteractionService) MCP Client reported error for [${serverName}/${toolName}]:`,
        result.content
      );
      const response: McpServiceResponse = {
        success: false,
        error: `MCP Client Error during ${toolName}`,
        details: result.content, // The content here is usually the error details
      };
      return JSON.stringify(response);
    }

    // Process content: Attempt to parse JSON if content is an array of text elements
    let finalContent: any = result.content; // Default to original content

    if (Array.isArray(result.content)) {
      finalContent = result.content.map((item: any) => {
        if (item && typeof item === 'object' && typeof item.text === 'string') {
          try {
            const parsedText = JSON.parse(item.text);
            // Create a new object combining original type and parsed text as content
            // Or, if parsedText itself contains an agent error, handle that.
            if (
              parsedText &&
              typeof parsedText === 'object' &&
              parsedText.error
            ) {
              console.warn(
                `(McpInteractionService) Agent [${serverName}/${toolName}] returned an error structure within item:`,
                parsedText.error
              );
              // Return an object indicating item-level error
              return {
                type: 'error',
                error: `Agent Error: ${parsedText.error}`,
                details: parsedText,
              };
            }
            // Return the parsed object directly, replacing the original item
            return parsedText;
          } catch (parseError) {
            // If parsing fails for this item, log warning but keep the original item
            console.warn(
              `(McpInteractionService) Failed to parse JSON in item text for [${serverName}/${toolName}]. Text was: ${item.text}. Keeping original item. Parse error:`,
              parseError
            );
            return item; // Keep original item
          }
        } else {
          // If item doesn't have string text, keep it as is
          return item;
        }
      });
    }
    // If result.content wasn't an array initially, finalContent remains result.content
    // This handles single non-array content like plain text or other structures.

    // Note: The previous logic for single string parsing is removed as the array map handles it.
    /* REMOVED single parse logic:
    else if (typeof result.content === 'string') { ... }
    */

    const response: McpServiceResponse = {
      success: true,
      details: finalContent, // Send the potentially transformed array (or original content)
    };
    return JSON.stringify(response);
  } catch (error: unknown) {
    console.error(
      `(McpInteractionService) Error calling MCP tool [${serverName}/${toolName}]:`,
      error
    );
    const errorMessage = error instanceof Error ? error.message : String(error);
    const response: McpServiceResponse = {
      success: false,
      error: `Failed to execute ${toolName} on ${serverName}.`,
      details: errorMessage,
      rawError: error, // Optionally include the raw error for deeper debugging if needed
    };
    return JSON.stringify(response);
  }
}
