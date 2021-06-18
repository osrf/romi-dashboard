import { createMuiTheme } from '@material-ui/core/styles';
import commonTheme from './common-theme';

export const rmfLight = createMuiTheme({
  palette: {
    ...commonTheme,
    text: {
      primary: '#1F396B',
    },
    background: {
      default: '#F3F3F3',
      paper: '#FFFFFF',
    },
  },
});
