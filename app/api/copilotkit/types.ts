export interface McpConfig {
  systemPrompt: string;
  llm: {
    provider: string;
    model: string;
    region: string;
    aws_access_key_id?: string;
    aws_secret_access_key?: string;
    temperature?: number;
  };
  mcpServers: Record<
    string,
    {
      command: string;
      args: string[];
      env?: Record<string, string>;
    }
  >;
}

// Add other shared types here if needed

// Interface for defining actions consumable by CopilotKit
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AgentAction<TArgs = any> {
  name: string;
  description: string;
  parameters: {
    name: string;
    type: string;
    description: string;
    required?: boolean;
    // Allow 'any' for flexibility in parameter defaults
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    default?: any;
    // Handle array types, potentially nested
    items?: {
      type: string;
      items?: {
        type: string;
      };
    };
  }[];
  // Handler function that takes typed arguments and returns a string promise
  handler: (args: TArgs) => Promise<string>;
}
