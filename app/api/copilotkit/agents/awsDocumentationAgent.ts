import { getMcpClient } from '../utils/mcpClientManager';

// Define an interface for the action structure using a generic for handler args
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CopilotAction<TArgs = any> {
  name: string;
  description: string;
  parameters: {
    name: string;
    type: string;
    description: string;
    required?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default?: any; // Keeping 'any' for default, ignoring lint rule
    items?: {
      type: string;
      items?: {
        // Add nested items for array of arrays
        type: string;
      };
    };
  }[];
  handler: (args: TArgs) => Promise<string>; // Use TArgs for handler args
}

// Define the actions for the AWS Documentation agent using the interface
// Let TypeScript infer TArgs or explicitly set if needed (defaults to any)
export const awsDocumentationActions: CopilotAction[] = [
  {
    name: 'AWSDocumentation_read_documentation',
    description:
      'Fetches an AWS documentation page and converts it to markdown format.',
    parameters: [
      {
        name: 'url',
        type: 'string',
        description: 'URL of the AWS documentation page.',
        required: true,
      },
    ],
    handler: async (args: { url: string }): Promise<string> => {
      const { url } = args;
      const serverName = 'aws-documentation';
      try {
        const client = await getMcpClient(serverName);
        const result = await client.callTool({
          name: 'read_documentation',
          arguments: { url },
        });

        console.log(
          '(awsDocumentationAgent) Raw AWSDocumentation_read_documentation result:',
          JSON.stringify(result, null, 2)
        );
        // Ensure a stringifiable value is always returned to avoid LLM errors
        return JSON.stringify(
          result?.content || { message: 'No content received from tool' }
        );
      } catch (error: unknown) {
        console.error('(awsDocumentationAgent) Read error:', error);
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        if (errorMessage?.includes('connect')) {
          console.error(
            `(awsDocumentationAgent) Connection error detected for ${serverName}`
          );
        }
        return JSON.stringify({
          error: 'Failed to read AWS documentation using MCP SDK.',
          details: errorMessage,
        });
      }
    },
  },
  {
    name: 'AWSDocumentation_search_documentation',
    description:
      'Searches AWS documentation using the official AWS Documentation Search API.',
    parameters: [
      {
        name: 'search_phrase',
        type: 'string',
        description: 'The phrase to search for.',
        required: true,
      },
      {
        name: 'limit',
        type: 'number',
        description: 'Maximum number of results to return.',
        required: false,
        default: 10,
      },
    ],
    handler: async (args: {
      search_phrase: string;
      limit?: number;
    }): Promise<string> => {
      const { search_phrase, limit } = args;
      const serverName = 'aws-documentation';
      try {
        const client = await getMcpClient(serverName);
        const result = await client.callTool({
          name: 'search_documentation',
          arguments: { search_phrase, limit: limit ?? 10 },
        });

        console.log(
          '(awsDocumentationAgent) Raw AWSDocumentation_search_documentation result:',
          JSON.stringify(result, null, 2)
        );
        // Ensure a stringifiable value is always returned
        return JSON.stringify(
          result?.content || { message: 'No content received from tool' }
        );
      } catch (error: unknown) {
        console.error('(awsDocumentationAgent) Search error:', error);
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        if (errorMessage?.includes('connect')) {
          console.error(
            `(awsDocumentationAgent) Connection error detected for ${serverName}`
          );
        }
        return JSON.stringify({
          error: 'Failed to search AWS documentation using MCP SDK.',
          details: errorMessage,
        });
      }
    },
  },
  {
    name: 'AWSDocumentation_recommend',
    description: 'Gets content recommendations for an AWS documentation page.',
    parameters: [
      {
        name: 'url',
        type: 'string',
        description:
          'URL of the AWS documentation page to get recommendations for.',
        required: true,
      },
    ],
    handler: async (args: { url: string }): Promise<string> => {
      const { url } = args;
      const serverName = 'aws-documentation';
      try {
        const client = await getMcpClient(serverName);
        const result = await client.callTool({
          name: 'recommend',
          arguments: { url },
        });

        console.log(
          '(awsDocumentationAgent) Raw AWSDocumentation_recommend result:',
          JSON.stringify(result, null, 2)
        );
        // Ensure a stringifiable value is always returned
        return JSON.stringify(
          result?.content || { message: 'No content received from tool' }
        );
      } catch (error: unknown) {
        console.error('(awsDocumentationAgent) Recommend error:', error);
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        if (errorMessage?.includes('connect')) {
          console.error(
            `(awsDocumentationAgent) Connection error detected for ${serverName}`
          );
        }
        return JSON.stringify({
          error: 'Failed to get recommendations using MCP SDK.',
          details: errorMessage,
        });
      }
    },
  },
];
