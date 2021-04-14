import { createMuiTheme } from '@material-ui/core/styles';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    colors: {
      black: React.CSSProperties['color'];
      xanadu: React.CSSProperties['color'];
      stPatricksBlue: React.CSSProperties['color'];
      blueYonder: React.CSSProperties['color'];
      ghostWhite: React.CSSProperties['color'];
      indianYellow: React.CSSProperties['color'];
      fireOpal: React.CSSProperties['color'];
    };
  }
  interface ThemeOptions {
    colors: {
      black: React.CSSProperties['color'];
      xanadu: React.CSSProperties['color'];
      stPatricksBlue: React.CSSProperties['color'];
      blueYonder: React.CSSProperties['color'];
      ghostWhite: React.CSSProperties['color'];
      indianYellow: React.CSSProperties['color'];
      fireOpal: React.CSSProperties['color'];
    };
  }
}

export const customTheme = createMuiTheme({
  palette: {
    primary: {
      // Dark cornflower blue
      main: '#1F396B',
    },
    secondary: {
      // Light sea green
      main: '#20a39e',
    },
  },
  colors: {
    black: '#000000',
    xanadu: '#6B7D7D',
    stPatricksBlue: '#103375',
    blueYonder: '#5873A8',
    ghostWhite: '#FBFCFF',
    indianYellow: '#DEA54B',
    fireOpal: '#F25F5C',
  },
});