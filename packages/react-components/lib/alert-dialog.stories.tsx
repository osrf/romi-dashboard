import { Button } from '@material-ui/core';
import { Meta, Story } from '@storybook/react';
import React from 'react';
import { AlertDialog, AlertDialogProps } from './alert-dialog';

interface BaseStoryArgs {
  variant: AlertDialogProps['variant'];
  withCloseButton: boolean;
}

export default {
  title: 'Dialogs',
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: ['noIcon', 'warn'] as AlertDialogProps['variant'][],
      },
      defaultValue: 'warn',
    },
    withCloseButton: {
      name: 'With Close Button',
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
  },
} as Meta;

type ManagedProps = 'open' | 'onPositiveClick' | 'onNegativeClick' | 'onCloseClick';
function OpenDialogButton<P extends Pick<AlertDialogProps, ManagedProps>>(props: {
  DialogComponent: React.ComponentType<P>;
  withCloseButton: boolean;
  componentProps: Omit<P, ManagedProps>;
}) {
  const { DialogComponent, withCloseButton, componentProps } = props;
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open Dialog
      </Button>
      <DialogComponent
        open={open}
        onPositiveClick={() => setOpen(false)}
        onNegativeClick={() => setOpen(false)}
        onCloseClick={withCloseButton ? () => setOpen(false) : undefined}
        // couldn't figure out how to make typescript correctly infer componentProps
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(componentProps as any)}
      />
    </div>
  );
}

type AlertDialogStoryArgs = BaseStoryArgs & Pick<AlertDialogProps, 'title'>;
export const AlertDialogStory: Story<AlertDialogStoryArgs> = ({ withCloseButton, ...args }) => (
  <OpenDialogButton
    DialogComponent={AlertDialog}
    componentProps={args}
    withCloseButton={withCloseButton}
  />
);
AlertDialogStory.storyName = 'Alert Dialog';
AlertDialogStory.args = {
  title: 'Something has happened',
};
