import {
  // Action type import removed as 'any[]' is used below
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
  LangChainAdapter,
} from '@copilotkit/runtime';
import { BedrockChat } from '@langchain/community/chat_models/bedrock';
import fs from 'fs';
import { NextRequest } from 'next/server';
import path from 'path';
import { awsDocumentationActions } from './agents/awsDocumentationAgent';
import { powerPointAgentActions } from './agents/powerPointAgent';
// MCP Client Manager is implicitly used via the agent modules
// import { getMcpClient } from './utils/mcpClientManager';

// --- Load configuration ---
// Consider refactoring config loading into its own utility if used in many places
let config: any;
try {
  const configPath = path.join(process.cwd(), 'mcp.config.json');
  const configFile = fs.readFileSync(configPath, 'utf-8');
  config = JSON.parse(configFile);
} catch (error) {
  console.error('(route.ts) Error loading or parsing mcp.config.json:', error);
  config = { llm: {}, mcpServers: {} }; // Basic fallback
}

// --- Instantiate Bedrock Model ---
if (!config.llm || !config.llm.provider || config.llm.provider !== 'bedrock') {
  throw new Error(
    'Invalid or missing LLM configuration for Bedrock in mcp.config.json'
  );
}
if (!config.llm.model || !config.llm.region) {
  throw new Error('Missing model or region in Bedrock LLM configuration');
}

// Security Note: Reading keys directly from config is not recommended for production.
// Prefer environment variables or IAM roles.
const credentials = {
  accessKeyId: config.llm.aws_access_key_id || process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey:
    config.llm.aws_secret_access_key || process.env.AWS_SECRET_ACCESS_KEY,
};

if (!credentials.accessKeyId || !credentials.secretAccessKey) {
  // Warning if credentials aren't found, but allow proceeding (e.g., for IAM roles)
  console.warn(
    'AWS credentials not found in mcp.config.json or environment variables. Ensure your environment is configured correctly (e.g., IAM role).'
  );
}

const model = new BedrockChat({
  model: config.llm.model,
  region: config.llm.region,
  temperature: config.llm.temperature ?? 0.1,
  credentials:
    credentials.accessKeyId && credentials.secretAccessKey
      ? credentials
      : undefined,
  modelKwargs: {
    // Required for Claude 3 tool use on Bedrock
    anthropic_version: 'bedrock-2023-05-31',
  },
});

// --- LangChain Adapter Setup ---
const serviceAdapter = new LangChainAdapter({
  chainFn: async ({ messages, tools }) => {
    return model.bindTools(tools).stream(messages);
  },
});

// --- Aggregate Actions ---
const allActions: any[] = [
  ...awsDocumentationActions,
  ...powerPointAgentActions, // Currently exports an empty array
  // Add future agent actions here
];

// --- CopilotKit Runtime Setup ---
const runtime = new CopilotRuntime({
  actions: allActions,
});

// --- API Route Handler ---
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter: serviceAdapter,
    endpoint: '/api/copilotkit',
    // Note: System prompt injection might require specific CopilotKit/LangChain setup.
    // Currently relying on tool descriptions for the LLM.
  });

  return handleRequest(req);
};
