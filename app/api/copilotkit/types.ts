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
