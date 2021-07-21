import { Meta, Story } from '@storybook/react';
import React from 'react';
import { TransferList, TransferListProps } from './transfer-list';

export default {
  title: 'Transfer List',
  component: TransferList,
  argTypes: {
    leftItems: {
      control: false,
    },
    rightItems: {
      control: false,
    },
    leftTitle: {
      control: {
        type: 'text',
      },
      defaultValue: 'Choices',
    },
    rightTitle: {
      control: {
        type: 'text',
      },
      defaultValue: 'Choices',
    },
  },
} as Meta;

const numbers: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
};

export const TransferListStory: Story<TransferListProps> = (args) => {
  const [leftItems, setLeftItems] = React.useState(['one', 'two', 'three', 'four']);
  const [rightItems, setRightItems] = React.useState(['five', 'six', 'seven', 'eight']);
  return (
    <div style={{ width: '100%', height: 250 }}>
      <TransferList
        {...args}
        leftItems={leftItems}
        rightItems={rightItems}
        onTransfer={(left, right) => {
          left.sort((a, b) => numbers[a] - numbers[b]);
          setLeftItems(left);
          right.sort((a, b) => numbers[a] - numbers[b]);
          setRightItems(right);
        }}
      ></TransferList>
    </div>
  );
};

TransferListStory.storyName = 'Transfer List';
