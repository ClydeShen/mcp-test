// import { type CopilotAction } from '../types';
import { type AgentAction } from '../types';
import { callMcpTool } from '../utils/mcpInteractionService';

// --- TypeScript Interfaces for Handler Arguments (Define as needed) ---
interface CreateDocumentArgs {
  filename: string;
  title?: string;
  author?: string;
}

interface AddHeadingArgs {
  filename: string;
  text: string;
  level?: number;
}

// Define more argument interfaces for other tools...

export const wordAgentActions: AgentAction[] = [
  {
    name: 'WordAgent_create_document',
    description: 'Creates a new Word document with optional title and author.',
    parameters: [
      {
        name: 'filename',
        type: 'string',
        description:
          'The name of the Word file to create (e.g., my_document.docx).',
        required: true,
      },
      {
        name: 'title',
        type: 'string',
        description: 'Optional title for the document.',
        required: false,
      },
      {
        name: 'author',
        type: 'string',
        description: 'Optional author for the document.',
        required: false,
      },
    ],
    handler: async (args: CreateDocumentArgs): Promise<string> => {
      return callMcpTool('word-document-server', 'create_document', args);
    },
  },
  {
    name: 'WordAgent_add_heading',
    description: 'Adds a heading to a Word document.',
    parameters: [
      {
        name: 'filename',
        type: 'string',
        description: 'The name of the Word file.',
        required: true,
      },
      {
        name: 'text',
        type: 'string',
        description: 'The text of the heading.',
        required: true,
      },
      {
        name: 'level',
        type: 'number',
        description: 'The heading level (e.g., 1 for Heading 1). Default is 1.',
        required: false,
        default: 1,
      },
    ],
    handler: async (args: AddHeadingArgs): Promise<string> => {
      // Ensure default level is passed if not provided
      const finalArgs = { ...args, level: args.level ?? 1 };
      return callMcpTool('word-document-server', 'add_heading', finalArgs);
    },
  },
  // Add other actions here based on the Word server's API reference
  // Examples:
  // WordAgent_add_paragraph
  // WordAgent_add_table
  // WordAgent_get_document_text
  // WordAgent_format_text
  // WordAgent_save_document (Note: Python server README doesn't explicitly show save, but it's crucial)
];
