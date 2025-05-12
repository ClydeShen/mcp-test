// Remove getMcpClient import, it's now used by the service
// import { getMcpClient } from '../utils/mcpClientManager';
// Import the new service
import { callMcpTool } from '../utils/mcpInteractionService';
// Import the shared CopilotAction interface
// import { type CopilotAction } from '../types';
import { type AgentAction } from '../types';

// Define an interface for the action structure using a generic for handler args
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export interface CopilotAction<TArgs = any> {
//   name: string;
//   description: string;
//   parameters: {
//     name: string;
//     type: string;
//     description: string;
//     required?: boolean;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     default?: any; // Keeping 'any' for default, ignoring lint rule
//     items?: {
//       type: string;
//       items?: {
//         // Add nested items for array of arrays
//         type: string;
//       };
//     };
//   }[];
//   handler: (args: TArgs) => Promise<string>; // Use TArgs for handler args
// }

// Define the actions for the AWS Documentation agent using the interface
// Let TypeScript infer TArgs or explicitly set if needed (defaults to any)
// export const awsDocumentationActions: CopilotAction[] = [
export const awsDocumentationActions: AgentAction[] = [
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
    // Refactor handler to use callMcpTool
    handler: async (args: { url: string }): Promise<string> => {
      const serverName = 'aws-documentation';
      const toolName = 'read_documentation';
      // No try-catch, no direct client interaction, no JSON.stringify here
      return callMcpTool(serverName, toolName, args);
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
    // Refactor handler
    handler: async (args: {
      search_phrase: string;
      limit?: number;
    }): Promise<string> => {
      const serverName = 'aws-documentation';
      const toolName = 'search_documentation';
      // Ensure default limit is passed if not provided by CopilotKit
      const finalArgs = { ...args, limit: args.limit ?? 10 };
      return callMcpTool(serverName, toolName, finalArgs);
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
    // Refactor handler
    handler: async (args: { url: string }): Promise<string> => {
      const serverName = 'aws-documentation';
      const toolName = 'recommend';
      return callMcpTool(serverName, toolName, args);
    },
  },
];
