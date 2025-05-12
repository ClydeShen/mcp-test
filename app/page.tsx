'use client';

import { CopilotChat } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { CopilotActionHandler } from './components/CopilotActionHandler';
// Define fixed widths for the panes - Adjusted proportions
const chatPaneWidth = '65%';
const summaryPaneWidth = '35%';

export default function Home() {
  return (
    // Use a Box as the main container
    <Stack sx={{ height: '100vh' }}>
      <CopilotActionHandler />
      {/* Main Content Area */}
      <Stack direction='row' sx={{ height: '100%' }}>
        <Stack
          sx={{
            width: chatPaneWidth,
            height: '100%',
          }}
        >
          <Stack
            id='chat-pane'
            sx={{
              height: '100%',
              '--copilot-kit-primary-color': '#4F4F4F',
            }}
          >
            <CopilotChat
              labels={{
                title: 'Booking Assistant',
                initial: 'How can I help you book your stay?',
              }}
            />
          </Stack>
        </Stack>

        {/* Right Pane (Summary/Info) */}
        <Box
          sx={{
            width: summaryPaneWidth,
            height: '100%', // Use 100% of parent height
            overflowY: 'auto',
            borderLeft: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            p: 3,
          }}
        >
          {/* Replace content with example prompts */}
          <Typography variant='h6' gutterBottom>
            Example Prompts:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Search the AWS docs for 'EC2 instance types'" />
            </ListItem>
            <ListItem>
              <ListItemText primary='Can you read the intro section from the S3 developer guide?' />
            </ListItem>
            <ListItem>
              <ListItemText primary='Recommend some documentation about AWS security best practices.' />
            </ListItem>
            <ListItem>
              <ListItemText primary="Open the presentation './data/pptx/test.pptx'" />
            </ListItem>
            {/* Add more examples if needed */}
          </List>
        </Box>
      </Stack>
    </Stack>
  );
}
