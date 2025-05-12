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

  const examplePrompts = [
    "Search the AWS docs for 'EC2 instance types'",
    'Can you read the intro section from the S3 developer guide?',
    'Recommend some documentation about AWS security best practices.',
    "Open the presentation './data/pptx/test.pptx'",
    "Create a new presentation and add a title slide saying 'Hello World'",
    // Add more examples if needed
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
