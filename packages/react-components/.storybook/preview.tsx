import { ThemeProvider } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import defaultTheme from '@material-ui/core/styles/defaultTheme';
import { DecoratorFn } from '@storybook/react';
import { rmfDark, rmfLight, GlobalCss } from '../lib';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

const getTheme = (themeName: string): Theme => {
  switch (themeName) {
    case 'rmf-light':
      return rmfLight;
    case 'rmf-dark':
      return rmfDark;
    default:
      return defaultTheme;
  }
};

const withThemeProvider: DecoratorFn = (Story, context) => {
  const theme = getTheme(context.globals.theme);
  return (
    <ThemeProvider theme={theme}>
      <GlobalCss />
      <Story {...context} />
    </ThemeProvider>
  );
};
export const decorators = [withThemeProvider];

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'rmf-light',
    toolbar: {
      icon: 'circlehollow',
      // Array of plain string values or MenuItem shape (see below)
      items: ['material-default', 'rmf-light', 'rmf-dark'],
    },
  },
};
