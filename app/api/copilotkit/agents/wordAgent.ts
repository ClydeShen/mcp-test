import { type AgentAction } from '../types';
import { callMcpTool } from '../utils/mcpInteractionService';

// --- TypeScript Interfaces for Handler Arguments ---
interface CreateDocumentArgs {
  filename: string;
  title?: string;
  author?: string;
}

interface DocumentPathArgs {
  filename: string;
}

interface ListDocumentsArgs {
  directory?: string;
}

interface CopyDocumentArgs {
  source_filename: string;
  destination_filename?: string;
}

interface ConvertToPdfArgs {
  filename: string;
  output_filename?: string;
}

interface AddHeadingArgs {
  filename: string;
  text: string;
  level?: number;
}

interface AddParagraphArgs {
  filename: string;
  text: string;
  style?: string;
}

interface AddTableArgs {
  filename: string;
  rows: number;
  cols: number;
  data?: string[][]; // Assuming data is a 2D array of strings
}

interface AddPictureArgs {
  filename: string;
  image_path: string;
  width?: number; // Assuming Emu or similar unit if not specified; let agent handle specifics
}

interface GetParagraphTextArgs {
  filename: string;
  paragraph_index: number;
}

interface FindTextArgs {
  filename: string;
  text_to_find: string;
  match_case?: boolean;
  whole_word?: boolean;
}

interface FormatTextArgs {
  filename: string;
  paragraph_index: number;
  start_pos: number;
  end_pos: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string; // Assuming color is a string like 'FF0000' or named color if agent supports
  font_size?: number; // Assuming Pt or similar unit
  font_name?: string;
}

interface SearchAndReplaceArgs {
  filename: string;
  find_text: string;
  replace_text: string;
}

interface DeleteParagraphArgs {
  filename: string;
  paragraph_index: number;
}

interface CreateCustomStyleArgs {
  filename: string;
  style_name: string;
  bold?: boolean;
  italic?: boolean;
  font_size?: number;
  font_name?: string;
  color?: string;
  base_style?: string;
}

interface FormatTableArgs {
  filename: string;
  table_index: number;
  has_header_row?: boolean;
  border_style?: string; // Agent needs to define supported styles
  shading?: string; // Agent needs to define supported colors/patterns
}

export const wordAgentActions: AgentAction<any>[] = [
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
    handler: async (args: CreateDocumentArgs) =>
      callMcpTool('word-document-server', 'create_document', args),
  },
  {
    name: 'WordAgent_get_document_info',
    description: 'Gets metadata information about the specified Word document.',
    parameters: [
      {
        name: 'filename',
        type: 'string',
        description: 'The name of the Word file.',
        required: true,
      },
    ],
    handler: async (args: DocumentPathArgs) =>
      callMcpTool('word-document-server', 'get_document_info', args),
  },
  {
    name: 'WordAgent_get_document_text',
    description: 'Extracts all text from the specified Word document.',
    parameters: [
      {
        name: 'filename',
        type: 'string',
        description: 'The name of the Word file.',
        required: true,
      },
    ],
    handler: async (args: DocumentPathArgs) =>
      callMcpTool('word-document-server', 'get_document_text', args),
  },
  {
    name: 'WordAgent_get_document_outline',
    description:
      'Gets the document outline (headings) from the specified Word document.',
    parameters: [
      {
        name: 'filename',
        type: 'string',
        description: 'The name of the Word file.',
        required: true,
      },
    ],
    handler: async (args: DocumentPathArgs) =>
      callMcpTool('word-document-server', 'get_document_outline', args),
  },
  {
    name: 'WordAgent_list_available_documents',
    description:
      'Lists available Word documents in a specified directory (defaults to current server directory).',
    parameters: [
      {
        name: 'directory',
        type: 'string',
        description:
          "The directory to search (e.g., './data/docs'). Defaults to server root.",
        required: false,
        default: '.',
      },
    ],
    handler: async (args: ListDocumentsArgs) =>
      callMcpTool('word-document-server', 'list_available_documents', {
        ...args,
        directory: args.directory ?? '.',
      }),
  },
  {
    name: 'WordAgent_copy_document',
    description: 'Creates a copy of an existing Word document.',
    parameters: [
      {
        name: 'source_filename',
        type: 'string',
        description: 'The name of the source Word file.',
        required: true,
      },
      {
        name: 'destination_filename',
        type: 'string',
        description:
          'Optional name for the new copy. If omitted, a name will be generated.',
        required: false,
      },
    ],
    handler: async (args: CopyDocumentArgs) =>
      callMcpTool('word-document-server', 'copy_document', args),
  },
  {
    name: 'WordAgent_convert_to_pdf',
    description: 'Converts the specified Word document to PDF format.',
    parameters: [
      {
        name: 'filename',
        type: 'string',
        description: 'The name of the Word file to convert.',
        required: true,
      },
      {
        name: 'output_filename',
        type: 'string',
        description:
          'Optional name for the output PDF file. If omitted, uses original name with .pdf extension.',
        required: false,
      },
    ],
    handler: async (args: ConvertToPdfArgs) =>
      callMcpTool('word-document-server', 'convert_to_pdf', args),
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
    handler: async (args: AddHeadingArgs) =>
      callMcpTool('word-document-server', 'add_heading', {
        ...args,
        level: args.level ?? 1,
      }),
  },
  {
    name: 'WordAgent_add_paragraph',
    description:
      'Inserts a paragraph with optional styling into a Word document.',
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
        description: 'The text of the paragraph.',
        required: true,
      },
      {
        name: 'style',
        type: 'string',
        description:
          "Optional paragraph style to apply (e.g., 'Normal', 'BodyText').",
        required: false,
      },
    ],
    handler: async (args: AddParagraphArgs) =>
      callMcpTool('word-document-server', 'add_paragraph', args),
  },
  {
    name: 'WordAgent_add_table',
    description: 'Creates a table with custom data in a Word document.',
    parameters: [
      {
        name: 'filename',
        type: 'string',
        description: 'The name of the Word file.',
        required: true,
      },
      {
        name: 'rows',
        type: 'number',
        description: 'Number of rows in the table.',
        required: true,
      },
      {
        name: 'cols',
        type: 'number',
        description: 'Number of columns in the table.',
        required: true,
      },
      {
        name: 'data',
        type: 'array',
        items: { type: 'array', items: { type: 'string' } },
        description:
          'Optional 2D array of strings to populate the table cells.',
        required: false,
      },
    ],
    handler: async (args: AddTableArgs) =>
      callMcpTool('word-document-server', 'add_table', args),
  },
  {
    name: 'WordAgent_add_picture',
    description: 'Adds an image with proportional scaling to a Word document.',
    parameters: [
      {
        name: 'filename',
        type: 'string',
        description: 'The name of the Word file.',
        required: true,
      },
      {
        name: 'image_path',
        type: 'string',
        description: 'The server-side file path of the image to add.',
        required: true,
      },
      {
        name: 'width',
        type: 'number',
        description:
          'Optional width for the image (e.g., in inches or cm; agent determines units).',
        required: false,
      },
    ],
    handler: async (args: AddPictureArgs) =>
      callMcpTool('word-document-server', 'add_picture', args),
  },
  {
    name: 'WordAgent_add_page_break',
    description: 'Inserts a page break into the Word document.',
    parameters: [
      {
        name: 'filename',
        type: 'string',
        description: 'The name of the Word file.',
        required: true,
      },
    ],
    handler: async (args: DocumentPathArgs) =>
      callMcpTool('word-document-server', 'add_page_break', args),
  },
  {
    name: 'WordAgent_get_paragraph_text_from_document',
    description: 'Extracts text from a specific paragraph in a Word document.',
    parameters: [
      {
        name: 'filename',
        type: 'string',
        description: 'The name of the Word file.',
        required: true,
      },
      {
        name: 'paragraph_index',
        type: 'number',
        description: 'The 0-based index of the paragraph.',
        required: true,
      },
    ],
    handler: async (args: GetParagraphTextArgs) =>
      callMcpTool(
        'word-document-server',
        'get_paragraph_text_from_document',
        args
      ),
  },
  {
    name: 'WordAgent_find_text_in_document',
    description: 'Finds text within a Word document.',
    parameters: [
      {
        name: 'filename',
        type: 'string',
        description: 'The name of the Word file.',
        required: true,
      },
      {
        name: 'text_to_find',
        type: 'string',
        description: 'The text to search for.',
        required: true,
      },
      {
        name: 'match_case',
        type: 'boolean',
        description:
          'Whether the search should be case-sensitive. Default is true.',
        required: false,
        default: true,
      },
      {
        name: 'whole_word',
        type: 'boolean',
        description: 'Whether to match whole words only. Default is false.',
        required: false,
        default: false,
      },
    ],
    handler: async (args: FindTextArgs) =>
      callMcpTool('word-document-server', 'find_text_in_document', {
        ...args,
        match_case: args.match_case ?? true,
        whole_word: args.whole_word ?? false,
      }),
  },
  {
    name: 'WordAgent_format_text',
    description: 'Formats a specific range of text within a paragraph.',
    parameters: [
      {
        name: 'filename',
        type: 'string',
        description: 'The name of the Word file.',
        required: true,
      },
      {
        name: 'paragraph_index',
        type: 'number',
        description: '0-based index of the paragraph containing the text.',
        required: true,
      },
      {
        name: 'start_pos',
        type: 'number',
        description: '0-based start character position within the paragraph.',
        required: true,
      },
      {
        name: 'end_pos',
        type: 'number',
        description:
          '0-based end character position (exclusive) within the paragraph.',
        required: true,
      },
      {
        name: 'bold',
        type: 'boolean',
        description: 'Apply bold formatting.',
        required: false,
      },
      {
        name: 'italic',
        type: 'boolean',
        description: 'Apply italic formatting.',
        required: false,
      },
      {
        name: 'underline',
        type: 'boolean',
        description: 'Apply underline formatting.',
        required: false,
      },
      {
        name: 'color',
        type: 'string',
        description: "Text color (e.g., 'FF0000' or a named color).",
        required: false,
      },
      {
        name: 'font_size',
        type: 'number',
        description: 'Font size (e.g., in points).',
        required: false,
      },
      {
        name: 'font_name',
        type: 'string',
        description: "Font name (e.g., 'Calibri').",
        required: false,
      },
    ],
    handler: async (args: FormatTextArgs) =>
      callMcpTool('word-document-server', 'format_text', args),
  },
  {
    name: 'WordAgent_search_and_replace',
    description: 'Searches and replaces text throughout the document.',
    parameters: [
      {
        name: 'filename',
        type: 'string',
        description: 'The name of the Word file.',
        required: true,
      },
      {
        name: 'find_text',
        type: 'string',
        description: 'The text to find.',
        required: true,
      },
      {
        name: 'replace_text',
        type: 'string',
        description: 'The text to replace with.',
        required: true,
      },
    ],
    handler: async (args: SearchAndReplaceArgs) =>
      callMcpTool('word-document-server', 'search_and_replace', args),
  },
  {
    name: 'WordAgent_delete_paragraph',
    description: 'Deletes a specific paragraph from the document.',
    parameters: [
      {
        name: 'filename',
        type: 'string',
        description: 'The name of the Word file.',
        required: true,
      },
      {
        name: 'paragraph_index',
        type: 'number',
        description: '0-based index of the paragraph to delete.',
        required: true,
      },
    ],
    handler: async (args: DeleteParagraphArgs) =>
      callMcpTool('word-document-server', 'delete_paragraph', args),
  },
  {
    name: 'WordAgent_create_custom_style',
    description: 'Creates a custom document style.',
    parameters: [
      {
        name: 'filename',
        type: 'string',
        description: 'The name of the Word file.',
        required: true,
      },
      {
        name: 'style_name',
        type: 'string',
        description: 'The name for the new style.',
        required: true,
      },
      {
        name: 'bold',
        type: 'boolean',
        description: 'Apply bold formatting to the style.',
        required: false,
      },
      {
        name: 'italic',
        type: 'boolean',
        description: 'Apply italic formatting to the style.',
        required: false,
      },
      {
        name: 'font_size',
        type: 'number',
        description: 'Font size for the style.',
        required: false,
      },
      {
        name: 'font_name',
        type: 'string',
        description: 'Font name for the style.',
        required: false,
      },
      {
        name: 'color',
        type: 'string',
        description: 'Text color for the style.',
        required: false,
      },
      {
        name: 'base_style',
        type: 'string',
        description:
          'Optional name of an existing style to base the new style on.',
        required: false,
      },
    ],
    handler: async (args: CreateCustomStyleArgs) =>
      callMcpTool('word-document-server', 'create_custom_style', args),
  },
  {
    name: 'WordAgent_format_table',
    description: 'Applies formatting to a table in the document.',
    parameters: [
      {
        name: 'filename',
        type: 'string',
        description: 'The name of the Word file.',
        required: true,
      },
      {
        name: 'table_index',
        type: 'number',
        description: '0-based index of the table in the document.',
        required: true,
      },
      {
        name: 'has_header_row',
        type: 'boolean',
        description:
          'Specifies if the table has a header row to be formatted distinctly.',
        required: false,
      },
      {
        name: 'border_style',
        type: 'string',
        description:
          "Style for table borders (e.g., 'single', 'double'; agent specific).",
        required: false,
      },
      {
        name: 'shading',
        type: 'string',
        description:
          "Cell shading color or pattern (e.g., 'light_gray'; agent specific).",
        required: false,
      },
    ],
    handler: async (args: FormatTableArgs) =>
      callMcpTool('word-document-server', 'format_table', args),
  },
];
