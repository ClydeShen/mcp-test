'use client';

import { CopilotChat, CopilotKitCSSProperties } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
// MUI Imports
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { Stack, Typography } from '@mui/material';
import configJson from '../mcp.config.json';
import { CustomAssistantMessage } from './components/AssistantMessage';
import { CopilotActionHandler } from './components/CopilotActionHandler';
import Layout from './components/Layout';
// const drawerWidth = '65vw'; // Keep a fixed width for the persistent drawer

const INSTRUCTIONS = configJson.systemPrompt;

export default function Home() {
  const theme = useTheme();

  // Updated example prompts based on AWS, PowerPoint, and Word tools
  const examplePrompts = [
    // AWS Docs Examples
    'Search AWS docs for Lambda execution environments.',
    'Can you find documentation on S3 bucket policies? Limit to 5 results.',
    'Read the documentation page at https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html',
    // PowerPoint Examples
    'Create a new PowerPoint presentation.',
    // (Requires presentation ID from create/open)
    "Add a new slide (layout 1) with the title 'Introduction' to the current presentation.",
    "Save the current presentation as './output/my_new_presentation.pptx'.",
    // Word Examples (Expanded)
    "Create a new Word document named 'report.docx' with author 'AI Assistant'.",
    "Add a level 1 heading 'Q3 Summary' to 'report.docx'.",
    "Add a paragraph 'Sales increased by 15% compared to Q2.' to 'report.docx'.",
    "Add a 2x2 table to 'report.docx' with data [['Region', 'Sales'], ['North', '10000']].",
    "Format the text '15%' in the first paragraph of 'report.docx' to be bold.",
    "Search for the text 'Sales' in 'report.docx'.",
    "Get the full text content of 'report.docx'.",
    "Convert 'report.docx' to PDF.",
  ];

  return (
    <Layout>
      <Stack flex={1} spacing={4}>
        <Typography
          variant='h4'
          component='h2'
          sx={{ color: 'white' }}
          gutterBottom
        >
          Enterprise Architecture assistant.
        </Typography>
        <CopilotActionHandler />
        <Box
          component={'div'}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
          style={
            {
              ['--copilot-kit-primary-color']: 'rgb(0, 164, 95)',
              ['--copilot-kit-contrast-color']: 'rgb(255, 255, 255)',
              ['--copilot-kit-secondary-color']: 'rgb(240, 242, 245)',
              ['--copilot-kit-secondary-contrast-color']: 'rgb(50, 50, 50)',
              ['--copilot-kit-background-color']: 'rgb(255, 255, 255)',
              ['--copilot-kit-muted-color']: 'rgb(90, 99, 118)',
              ['--copilot-kit-separator-color']: 'rgba(50, 50, 50, 0.08)',
              ['--copilot-kit-scrollbar-color']: 'rgba(50, 50, 50, 0.2)',
              ['--copilot-kit-response-button-color']: 'rgb(50, 50, 50)',
              ['--copilot-kit-response-button-background-color']:
                'rgb(255, 255, 255)',
              // ['.']
            } as CopilotKitCSSProperties
          }
        >
          <CopilotChat
            className='h-full flex flex-col'
            instructions={INSTRUCTIONS}
            labels={{
              title: 'MCP Assistant',
              initial: 'Need any help?',
            }}
            AssistantMessage={CustomAssistantMessage}
          />
        </Box>
      </Stack>
    </Layout>
  );
}
