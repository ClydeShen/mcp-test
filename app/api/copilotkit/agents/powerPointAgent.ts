'use strict';
// Currently disabled: The underlying agent's get_slide_info tool
// does not return text content needed for extraction.
// Keep this commented code as a reference for future implementation
// when the agent is updated or replaced.

import { getMcpClient } from '../utils/mcpClientManager';

// --- TypeScript Interfaces for Handler Arguments ---
interface SetCorePropertiesArgs {
  presentation_id: string;
  title?: string;
  author?: string;
  // Add other potential properties here
}

interface AddSlideArgs {
  presentation_id: string;
  layout_index: number;
  title?: string;
}

interface GetSlideInfoArgs {
  presentation_id: string;
  slide_index: number;
}

interface PopulatePlaceholderArgs {
  presentation_id: string;
  slide_index: number;
  placeholder_idx: number;
  text: string;
}

interface AddBulletPointsArgs {
  presentation_id: string;
  slide_index: number;
  placeholder_idx: number;
  bullet_points: string[];
  level?: number;
}

interface AddTextboxArgs {
  presentation_id: string;
  slide_index: number;
  text: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

interface AddImageArgs {
  presentation_id: string;
  slide_index: number;
  image_path: string;
  left: number;
  top: number;
  width?: number;
  height?: number;
}

interface AddImageFromBase64Args {
  presentation_id: string;
  slide_index: number;
  base64_string: string;
  left: number;
  top: number;
  width?: number;
  height?: number;
}

interface AddTableArgs {
  presentation_id: string;
  slide_index: number;
  rows: number;
  cols: number;
  left: number;
  top: number;
  width: number;
  height: number;
}

interface FormatTableCellArgs {
  presentation_id: string;
  slide_index: number;
  shape_id: string; // Assuming shape ID identifies the table
  row: number;
  col: number;
  text?: string;
  // Add formatting options here
}

interface AddShapeArgs {
  presentation_id: string;
  slide_index: number;
  shape_type_id: number; // Or string?
  left: number;
  top: number;
  width: number;
  height: number;
}

interface AddChartArgs {
  presentation_id: string;
  slide_index: number;
  chart_type: string;
  left: number;
  top: number;
  width: number;
  height: number;
  categories: string[];
  series_names: string[];
  series_values: number[][];
  title?: string;
  has_legend?: boolean;
  legend_position?: string;
  has_data_labels?: boolean;
}

// --- Helper function for generic MCP tool calls ---
async function handlePptToolCall(
  toolName: string,
  args: any,
  requiredParams: string[]
) {
  const missingParams = requiredParams.filter((param) => !(param in args));
  if (missingParams.length > 0) {
    return JSON.stringify({
      error: `Missing required parameters: ${missingParams.join(', ')}`,
    });
  }

  const serverName = 'powerpoint';
  try {
    const client = await getMcpClient(serverName);
    console.log(`(powerPointAgent) Calling ${toolName} with args:`, args);
    const result = await client.callTool({ name: toolName, arguments: args });
    console.log(
      `(powerPointAgent) Raw ${toolName} result:`,
      JSON.stringify(result, null, 2)
    );

    // Attempt to parse JSON content if present
    try {
      if (
        Array.isArray(result.content) &&
        result.content.length > 0 &&
        typeof result.content[0]?.text === 'string'
      ) {
        const parsedContent = JSON.parse(result.content[0].text);
        // Check specifically for error structure from the agent
        if (parsedContent.error) {
          console.error(
            `(powerPointAgent) Agent returned error for ${toolName}:`,
            parsedContent.error
          );
          return JSON.stringify({
            error: `Agent error: ${parsedContent.error}`,
            details: parsedContent,
          });
        }
        return JSON.stringify({ success: true, details: parsedContent });
      } else if (result.isError) {
        console.error(
          `(powerPointAgent) MCP client indicated error for ${toolName}:`,
          result.content
        );
        // Assert content as any/unknown before stringifying for error message
        const errorDetails = JSON.stringify(result.content as unknown);
        return JSON.stringify({
          error: `MCP Client Error during ${toolName}`,
          details: errorDetails,
        });
      } else {
        console.warn(
          `(powerPointAgent) Unexpected raw result structure for ${toolName}, returning raw.`
        );
        // Assert content as any/unknown before stringifying for raw details
        const rawDetails = JSON.stringify(result.content as unknown);
        return JSON.stringify({ success: true, raw_details: rawDetails });
      }
    } catch (parseError) {
      // We know parseError happened, likely on result.content[0].text
      // Log the error and the text that caused it, if possible
      let problematicText = '(unavailable)';
      try {
        if (
          Array.isArray(result.content) &&
          result.content.length > 0 &&
          typeof result.content[0]?.text === 'string'
        ) {
          problematicText = result.content[0].text;
        }
      } catch (e) {
        /* Ignore errors accessing result here */
      }

      console.warn(
        `(powerPointAgent) Failed to parse JSON result for ${toolName}. Problematic text: ${problematicText}`,
        parseError
      );
      // Return a structured error indicating parse failure
      return JSON.stringify({
        success: false,
        error: `Failed to parse agent response for ${toolName}.`,
        details: `Parse Error: ${
          parseError instanceof Error ? parseError.message : String(parseError)
        }`,
      });
    }
  } catch (error: any) {
    console.error(`(powerPointAgent) Agent error calling ${toolName}:`, error);
    // Handle network/connection errors specifically if possible
    const errorMessage = error.message || 'Unknown error';
    return JSON.stringify({
      error: `Failed to execute PowerPoint ${toolName} command.`,
      details: errorMessage,
    });
  }
}

// --- Define Actions based on README ---

const powerPointAgentActions: any[] = [
  // --- Presentation Tools ---
  {
    name: 'PowerPointAgent_create_presentation',
    description:
      'Creates a new, empty PowerPoint presentation and returns its ID.',
    parameters: [], // No specific parameters needed to create
    handler: async () => handlePptToolCall('create_presentation', {}, []),
  },
  {
    name: 'PowerPointAgent_open_presentation',
    description:
      'Opens an existing PowerPoint (.pptx) file and returns its internal presentation ID and slide count.',
    parameters: [
      {
        name: 'file_path',
        type: 'string',
        description:
          'The path to the .pptx file (e.g., ./data/pptx/test.pptx or test.pptx relative to server).',
        required: true,
      },
    ],
    // Keep the specific handler for open_presentation as it needs careful ID extraction
    handler: async (args: { file_path: string }) => {
      const { file_path } = args;
      const serverName = 'powerpoint';
      let presentation_id: string | null = null;

      try {
        const client = await getMcpClient(serverName);
        console.log(
          `(powerPointAgent) Calling open_presentation for: ${file_path}`
        );
        const openResult = await client.callTool({
          name: 'open_presentation',
          arguments: { file_path: file_path },
        });
        console.log(
          '(powerPointAgent) Raw open_presentation result:',
          JSON.stringify(openResult, null, 2)
        );

        // Attempt to parse presentation_id and return useful info
        try {
          if (
            Array.isArray(openResult.content) &&
            openResult.content.length > 0 &&
            typeof openResult.content[0]?.text === 'string'
          ) {
            const textToParse = openResult.content[0].text;
            const parsedContent = JSON.parse(textToParse);

            if (parsedContent.error) {
              console.error(
                `(powerPointAgent) Agent error opening presentation:`,
                parsedContent.error
              );
              throw new Error(`Agent error: ${parsedContent.error}`);
            }

            presentation_id = parsedContent?.presentation_id;
            if (!presentation_id) {
              throw new Error('presentation_id not found in parsed content');
            }
            // Return the full parsed content which includes ID, message, slide_count
            return JSON.stringify({ success: true, details: parsedContent });
          } else if (openResult.isError) {
            console.error(
              '(powerPointAgent) MCP client reported error opening presentation:',
              openResult.content
            );
            throw new Error(
              `MCP Client error opening presentation: ${JSON.stringify(
                openResult.content
              )}`
            );
          } else {
            throw new Error(
              'Unexpected content structure from open_presentation'
            );
          }
        } catch (e: any) {
          console.error(
            '(powerPointAgent) Failed to parse open_presentation result or find presentation_id',
            e
          );
          // Rethrow with more context
          throw new Error(
            `(powerPointAgent) Failed to get presentation_id. Raw Result: ${JSON.stringify(
              openResult
            )}, Error: ${e.message}`
          );
        }
      } catch (error: any) {
        console.error(
          '(powerPointAgent) Agent/MCP error in open_presentation:',
          error
        );
        return JSON.stringify({
          error: 'Failed to execute PowerPoint open_presentation command.',
          details: error.message,
        });
      }
    },
  },
  {
    name: 'PowerPointAgent_save_presentation',
    description: 'Saves the specified presentation (by ID) to a file path.',
    parameters: [
      {
        name: 'presentation_id',
        type: 'string',
        description: 'The ID of the presentation to save.',
        required: true,
      },
      {
        name: 'file_path',
        type: 'string',
        description:
          'The path where the .pptx file should be saved (e.g., ./output/my_presentation.pptx).',
        required: true,
      },
    ],
    handler: async (args: { presentation_id: string; file_path: string }) =>
      handlePptToolCall('save_presentation', args, [
        'presentation_id',
        'file_path',
      ]),
  },
  {
    name: 'PowerPointAgent_get_presentation_info',
    description:
      'Gets metadata information (like slide count, properties) about the specified presentation (by ID).',
    parameters: [
      {
        name: 'presentation_id',
        type: 'string',
        description: 'The ID of the presentation.',
        required: true,
      },
    ],
    handler: async (args: { presentation_id: string }) =>
      handlePptToolCall('get_presentation_info', args, ['presentation_id']),
  },
  {
    name: 'PowerPointAgent_set_core_properties',
    description:
      'Sets core document properties (like title, author) for the presentation.',
    parameters: [
      {
        name: 'presentation_id',
        type: 'string',
        description: 'The ID of the presentation.',
        required: true,
      },
      {
        name: 'title',
        type: 'string',
        description: 'The title of the presentation.',
        required: false,
      },
      {
        name: 'author',
        type: 'string',
        description: 'The author of the presentation.',
        required: false,
      },
      // Add other properties like subject, keywords, category, comments as needed based on python-pptx capabilities
    ],
    handler: async (args: SetCorePropertiesArgs) =>
      handlePptToolCall('set_core_properties', args, ['presentation_id']),
  },

  // --- Slide Tools ---
  {
    name: 'PowerPointAgent_add_slide',
    description:
      'Adds a new slide to the presentation using a specified layout index. Optionally sets the title. Returns the new slide index.',
    parameters: [
      {
        name: 'presentation_id',
        type: 'string',
        description: 'The ID of the presentation.',
        required: true,
      },
      {
        name: 'layout_index',
        type: 'number',
        description:
          'The index of the slide layout master to use (e.g., 0 for title slide, 1 for title and content).',
        required: true,
      },
      {
        name: 'title',
        type: 'string',
        description:
          "Optional title text to add to the new slide's title placeholder.",
        required: false,
      },
    ],
    handler: async (args: AddSlideArgs) =>
      handlePptToolCall('add_slide', args, ['presentation_id', 'layout_index']),
  },
  {
    name: 'PowerPointAgent_get_slide_info',
    description:
      'Gets information (like shapes, layout, placeholders) about a specific slide by index.',
    parameters: [
      {
        name: 'presentation_id',
        type: 'string',
        description: 'The ID of the presentation.',
        required: true,
      },
      {
        name: 'slide_index',
        type: 'number',
        description: 'The zero-based index of the slide.',
        required: true,
      },
    ],
    handler: async (args: GetSlideInfoArgs) =>
      handlePptToolCall('get_slide_info', args, [
        'presentation_id',
        'slide_index',
      ]),
  },
  {
    name: 'PowerPointAgent_populate_placeholder',
    description: 'Populates a specific placeholder on a slide with text.',
    parameters: [
      {
        name: 'presentation_id',
        type: 'string',
        description: 'The ID of the presentation.',
        required: true,
      },
      {
        name: 'slide_index',
        type: 'number',
        description: 'The zero-based index of the slide.',
        required: true,
      },
      {
        name: 'placeholder_idx',
        type: 'number',
        description:
          'The index of the placeholder on the slide (use get_slide_info to find indices).',
        required: true,
      },
      {
        name: 'text',
        type: 'string',
        description: 'The text to insert into the placeholder.',
        required: true,
      },
    ],
    handler: async (args: PopulatePlaceholderArgs) =>
      handlePptToolCall('populate_placeholder', args, [
        'presentation_id',
        'slide_index',
        'placeholder_idx',
        'text',
      ]),
  },
  {
    name: 'PowerPointAgent_add_bullet_points',
    description: 'Adds bullet points to a specified placeholder on a slide.',
    parameters: [
      {
        name: 'presentation_id',
        type: 'string',
        description: 'The ID of the presentation.',
        required: true,
      },
      {
        name: 'slide_index',
        type: 'number',
        description: 'The zero-based index of the slide.',
        required: true,
      },
      {
        name: 'placeholder_idx',
        type: 'number',
        description:
          'The index of the placeholder (usually a body/content placeholder).',
        required: true,
      },
      {
        name: 'bullet_points',
        type: 'array',
        items: { type: 'string' }, // Specify item type for array
        description:
          'An array of strings, where each string is a bullet point.',
        required: true,
      },
      {
        name: 'level',
        type: 'number',
        description:
          'Optional indentation level for the bullet points (default 0).',
        required: false,
      },
    ],
    handler: async (args: AddBulletPointsArgs) =>
      handlePptToolCall('add_bullet_points', args, [
        'presentation_id',
        'slide_index',
        'placeholder_idx',
        'bullet_points',
      ]),
  },

  // --- Text Tools ---
  {
    name: 'PowerPointAgent_add_textbox',
    description:
      'Adds a textbox with the specified text to a slide at a given position and size. Returns shape ID.',
    parameters: [
      {
        name: 'presentation_id',
        type: 'string',
        description: 'The ID of the presentation.',
        required: true,
      },
      {
        name: 'slide_index',
        type: 'number',
        description: 'The zero-based index of the slide.',
        required: true,
      },
      {
        name: 'text',
        type: 'string',
        description: 'The text content for the textbox.',
        required: true,
      },
      {
        name: 'left',
        type: 'number',
        description: 'Position of the left edge in inches.',
        required: true,
      },
      {
        name: 'top',
        type: 'number',
        description: 'Position of the top edge in inches.',
        required: true,
      },
      {
        name: 'width',
        type: 'number',
        description: 'Width of the textbox in inches.',
        required: true,
      },
      {
        name: 'height',
        type: 'number',
        description: 'Height of the textbox in inches.',
        required: true,
      },
      // Add font formatting parameters if supported by the agent tool (e.g., font_size, bold, italic)
    ],
    handler: async (args: AddTextboxArgs) =>
      handlePptToolCall('add_textbox', args, [
        'presentation_id',
        'slide_index',
        'text',
        'left',
        'top',
        'width',
        'height',
      ]),
  },

  // --- Image Tools ---
  {
    name: 'PowerPointAgent_add_image',
    description:
      'Adds an image from a file path to a slide at a specified position and size. Returns shape ID.',
    parameters: [
      {
        name: 'presentation_id',
        type: 'string',
        description: 'The ID of the presentation.',
        required: true,
      },
      {
        name: 'slide_index',
        type: 'number',
        description: 'The zero-based index of the slide.',
        required: true,
      },
      {
        name: 'image_path',
        type: 'string',
        description: 'The file path of the image to add.',
        required: true,
      },
      {
        name: 'left',
        type: 'number',
        description: 'Position of the left edge in inches.',
        required: true,
      },
      {
        name: 'top',
        type: 'number',
        description: 'Position of the top edge in inches.',
        required: true,
      },
      {
        name: 'width',
        type: 'number',
        description:
          "Optional width of the image in inches. If omitted or set to 0, uses image's native width.",
        required: false,
      },
      {
        name: 'height',
        type: 'number',
        description:
          "Optional height of the image in inches. If omitted or set to 0, uses image's native height.",
        required: false,
      },
    ],
    handler: async (args: AddImageArgs) =>
      handlePptToolCall('add_image', args, [
        'presentation_id',
        'slide_index',
        'image_path',
        'left',
        'top',
      ]),
  },
  {
    name: 'PowerPointAgent_add_image_from_base64',
    description:
      'Adds an image from a base64 encoded string to a slide. Returns shape ID.',
    parameters: [
      {
        name: 'presentation_id',
        type: 'string',
        description: 'The ID of the presentation.',
        required: true,
      },
      {
        name: 'slide_index',
        type: 'number',
        description: 'The zero-based index of the slide.',
        required: true,
      },
      {
        name: 'base64_string',
        type: 'string',
        description:
          'The base64 encoded string of the image (without data URI prefix).',
        required: true,
      },
      {
        name: 'left',
        type: 'number',
        description: 'Position of the left edge in inches.',
        required: true,
      },
      {
        name: 'top',
        type: 'number',
        description: 'Position of the top edge in inches.',
        required: true,
      },
      {
        name: 'width',
        type: 'number',
        description: 'Optional width of the image in inches.',
        required: false,
      },
      {
        name: 'height',
        type: 'number',
        description: 'Optional height of the image in inches.',
        required: false,
      },
    ],
    handler: async (args: AddImageFromBase64Args) =>
      handlePptToolCall('add_image_from_base64', args, [
        'presentation_id',
        'slide_index',
        'base64_string',
        'left',
        'top',
      ]),
  },

  // --- Table Tools ---
  {
    name: 'PowerPointAgent_add_table',
    description:
      'Adds a table with specified rows and columns to a slide. Returns shape ID.',
    parameters: [
      {
        name: 'presentation_id',
        type: 'string',
        description: 'The ID of the presentation.',
        required: true,
      },
      {
        name: 'slide_index',
        type: 'number',
        description: 'The zero-based index of the slide.',
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
        name: 'left',
        type: 'number',
        description: 'Position of the left edge in inches.',
        required: true,
      },
      {
        name: 'top',
        type: 'number',
        description: 'Position of the top edge in inches.',
        required: true,
      },
      {
        name: 'width',
        type: 'number',
        description: 'Width of the table in inches.',
        required: true,
      },
      {
        name: 'height',
        type: 'number',
        description: 'Height of the table in inches.',
        required: true,
      },
      // NOTE: Need a way to populate table cells. Use format_table_cell.
    ],
    handler: async (args: AddTableArgs) =>
      handlePptToolCall('add_table', args, [
        'presentation_id',
        'slide_index',
        'rows',
        'cols',
        'left',
        'top',
        'width',
        'height',
      ]),
  },
  {
    name: 'PowerPointAgent_format_table_cell',
    description:
      "Sets text or applies formatting to a specific cell within a table. Requires the table's shape ID.",
    parameters: [
      {
        name: 'presentation_id',
        type: 'string',
        description: 'The ID of the presentation.',
        required: true,
      },
      {
        name: 'slide_index',
        type: 'number',
        description: 'The zero-based index of the slide containing the table.',
        required: true,
      },
      {
        name: 'shape_id',
        type: 'string', // Agent likely returns this from add_table
        description: 'The ID of the table shape on the slide.',
        required: true,
      },
      {
        name: 'row',
        type: 'number',
        description: 'Zero-based row index of the cell.',
        required: true,
      },
      {
        name: 'col',
        type: 'number',
        description: 'Zero-based column index of the cell.',
        required: true,
      },
      {
        name: 'text',
        type: 'string',
        description: 'Optional text to set in the cell.',
        required: false,
      },
      // Add other formatting parameters like font size, bold, alignment etc. as needed
    ],
    handler: async (args: FormatTableCellArgs) =>
      handlePptToolCall('format_table_cell', args, [
        'presentation_id',
        'slide_index',
        'shape_id',
        'row',
        'col',
      ]),
  },

  // --- Shape Tools ---
  {
    name: 'PowerPointAgent_add_shape',
    description:
      'Adds an auto shape (e.g., rectangle, oval) to a slide. Returns shape ID.',
    parameters: [
      {
        name: 'presentation_id',
        type: 'string',
        description: 'The ID of the presentation.',
        required: true,
      },
      {
        name: 'slide_index',
        type: 'number',
        description: 'The zero-based index of the slide.',
        required: true,
      },
      {
        name: 'shape_type_id',
        type: 'number', // Corresponds to MSO_SHAPE enum
        description:
          'Identifier for the type of shape (e.g., 1 for rectangle, 5 for oval). Refer to python-pptx MSO_SHAPE types.',
        required: true,
      },
      {
        name: 'left',
        type: 'number',
        description: 'Position of the left edge in inches.',
        required: true,
      },
      {
        name: 'top',
        type: 'number',
        description: 'Position of the top edge in inches.',
        required: true,
      },
      {
        name: 'width',
        type: 'number',
        description: 'Width of the shape in inches.',
        required: true,
      },
      {
        name: 'height',
        type: 'number',
        description: 'Height of the shape in inches.',
        required: true,
      },
    ],
    handler: async (args: AddShapeArgs) =>
      handlePptToolCall('add_shape', args, [
        'presentation_id',
        'slide_index',
        'shape_type_id',
        'left',
        'top',
        'width',
        'height',
      ]),
  },

  // --- Chart Tools ---
  {
    name: 'PowerPointAgent_add_chart',
    description:
      'Adds a chart (e.g., column, line, pie) to a slide with specified data. Returns shape ID.',
    parameters: [
      {
        name: 'presentation_id',
        type: 'string',
        description: 'The ID of the presentation.',
        required: true,
      },
      {
        name: 'slide_index',
        type: 'number',
        description: 'The zero-based index of the slide.',
        required: true,
      },
      {
        name: 'chart_type',
        type: 'string',
        // It's better to use enum/const for chart types if possible
        description:
          'Type of chart (e.g., "column", "line", "pie", "bar"). Refer to python-pptx XL_CHART_TYPE.',
        required: true,
      },
      {
        name: 'left',
        type: 'number',
        description: 'Position of the left edge in inches.',
        required: true,
      },
      {
        name: 'top',
        type: 'number',
        description: 'Position of the top edge in inches.',
        required: true,
      },
      {
        name: 'width',
        type: 'number',
        description: 'Width of the chart in inches.',
        required: true,
      },
      {
        name: 'height',
        type: 'number',
        description: 'Height of the chart in inches.',
        required: true,
      },
      {
        name: 'categories',
        type: 'array',
        items: { type: 'string' },
        description:
          'An array of strings for the chart categories (X-axis labels).',
        required: true,
      },
      {
        name: 'series_names',
        type: 'array',
        items: { type: 'string' },
        description: 'An array of strings for the names of each data series.',
        required: true,
      },
      {
        name: 'series_values',
        type: 'array',
        // Describe nested array structure
        items: {
          type: 'array',
          items: { type: 'number' },
        },
        description:
          'A 2D array of numbers representing the data values. Outer array corresponds to series, inner array corresponds to categories.',
        required: true,
      },
      {
        name: 'title',
        type: 'string',
        description: 'Optional title for the chart.',
        required: false,
      },
      {
        name: 'has_legend',
        type: 'boolean',
        description:
          'Optional: Whether the chart should have a legend (default true).',
        required: false,
      },
      {
        name: 'legend_position',
        type: 'string',
        // Consider enum for positions
        description:
          'Optional: Position of the legend (e.g., "bottom", "top_right"). Refer to python-pptx XL_LEGEND_POSITION.',
        required: false,
      },
      {
        name: 'has_data_labels',
        type: 'boolean',
        description:
          'Optional: Whether data labels should be shown on the chart (default false).',
        required: false,
      },
      // Add more chart formatting options as needed
    ],
    handler: async (args: AddChartArgs) =>
      handlePptToolCall('add_chart', args, [
        'presentation_id',
        'slide_index',
        'chart_type',
        'left',
        'top',
        'width',
        'height',
        'categories',
        'series_names',
        'series_values',
      ]),
  },

  // NOTE: No tool for extracting text content was found in the README.
  // Text extraction would require modification of the Python agent.
];

// Export the active actions array
export { powerPointAgentActions };
