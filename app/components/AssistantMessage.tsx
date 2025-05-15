import {
  AssistantMessageProps,
  Markdown,
  useChatContext,
} from '@copilotkit/react-ui';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Image from 'next/image';

import '@copilotkit/react-ui/styles.css';

export const CustomAssistantMessage = (props: AssistantMessageProps) => {
  const { icons } = useChatContext();
  const { message, isLoading, subComponent } = props;

  const avatar = (
    <Avatar
      sx={{
        bgcolor: 'grey.400',
        width: 40,
        height: 40,
        boxShadow: 3,
        border: 1,
        borderColor: 'grey.500',
      }}
    >
      <Image src='/logo.png' alt='Logo' width={40} height={40} />
    </Avatar>
  );

  return (
    <Box py={2}>
      <Box display='flex' alignItems='flex-start'>
        {!subComponent && avatar}
        <Paper
          elevation={0}
          sx={{
            bgcolor: (theme) => theme.palette.divider,
            px: 2,
            py: 1,
            borderRadius: 2,
            ml: !subComponent ? 2 : 0,
          }}
        >
          {message && <Markdown content={message || ''} />}
          {isLoading && icons.spinnerIcon}
        </Paper>
      </Box>
      <Box my={2}>{subComponent}</Box>
    </Box>
  );
};
