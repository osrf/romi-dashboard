import { Button, Paper, Typography } from '@material-ui/core';
import { Meta, Story } from '@storybook/react';
import React from 'react';
import { ConfirmationDialog, ConfirmationDialogProps } from './confirmation-dialog';

export default {
  title: 'Dialog/Confirmation Dialog',
  component: ConfirmationDialog,
} as Meta;

export const Default: Story<ConfirmationDialogProps> = (args) => {
  const [loading, setLoading] = React.useState(false);
  return (
    <ConfirmationDialog
      {...args}
      open={true}
      loading={loading}
      onSubmit={async () => {
        setLoading(true);
        await new Promise((res) => setTimeout(res, 500));
        setLoading(false);
      }}
      toolbar={
        <Button variant="contained" color="primary">
          Action
        </Button>
      }
    >
      <Paper variant="outlined" style={{ padding: 200 }}>
        <Typography>Content</Typography>
      </Paper>
    </ConfirmationDialog>
  );
};

Default.storyName = 'Confirmation Dialog';
