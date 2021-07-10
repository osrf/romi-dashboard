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

export const rmfDark = createMuiTheme({
  palette: {
    ...commonTheme,
    primary: {
      main: '#1F396B',
    },
    text: {
      primary: '#FBFCFF',
    },
    background: {
      default: '#103375',
      paper: '#1F396B',
    },
  },
  mapClass:
    'invert(90%) sepia(12%) saturate(5773%) hue-rotate(193deg) brightness(92%) contrast(92%)',
});
