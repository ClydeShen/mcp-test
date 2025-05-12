'use client';

import { CopilotChat } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
// MUI Imports
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { styled, Theme, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { CopilotActionHandler } from './components/CopilotActionHandler';

const drawerWidth = '65vw'; // Keep a fixed width for the persistent drawer

const Main = styled('main', {
  shouldForwardProp: (prop: string) => prop !== 'open',
})<{ open?: boolean }>(({ theme }: { theme: Theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
  marginLeft: 0,
}));

const INSTRUCTIONS =
  'You are a helpful assistant. You have access to tools for searching AWS documentation and manipulating PowerPoint files. Use these tools when appropriate.';

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
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      <CopilotActionHandler />

      <Drawer
        variant='persistent'
        anchor='left'
        open={true}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: `1px solid ${theme.palette.divider}`,
            '--copilot-kit-primary-color': `${theme.palette.primary.main}`,
          },
        }}
      >
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <CopilotChat
            className='h-full flex flex-col'
            instructions={INSTRUCTIONS}
            labels={{
              title: 'MCP Assistant',
              initial: 'Need any help?',
            }}
          />
        </Box>
      </Drawer>

      <Main>
        <Typography variant='h5' component='h2' gutterBottom>
          Example Prompts:
        </Typography>
        <List dense>
          {examplePrompts.map((prompt, index) => (
            <ListItem key={index} disablePadding>
              <ListItemText primary={prompt} sx={{ color: 'text.secondary' }} />
            </ListItem>
          ))}
        </List>
      </Main>
    </Box>
  );
}
