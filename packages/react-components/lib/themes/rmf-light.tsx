import { createMuiTheme } from '@material-ui/core/styles';
import commonTheme from './common-theme';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    mapClass: string;
  }
  interface ThemeOptions {
    mapClass: string;
  }
}

export const rmfLight = createMuiTheme({
  palette: {
    ...commonTheme,
    primary: {
      main: '#FFFFFF',
    },
    text: {
      primary: '#1F396B',
    },
    background: {
      default: '#F3F3F3',
      paper: '#FFFFFF',
    },
  },
  mapClass: '',
});
