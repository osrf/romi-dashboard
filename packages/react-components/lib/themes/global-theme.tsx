import { withStyles } from '@material-ui/core/styles';

export const GlobalCss = withStyles((theme) => ({
  '@global': {
    // override accordian background to distinguish it from onipanel
    '.MuiAccordion-root': {
      backgroundColor: theme.palette.background.default,
    },
    // override text color of disabled button to make it visible
    '.MuiButtonBase-root.Mui-disabled': {
      color: theme.palette.text.primary,
    },
    // highlight table header in panels
    '.MuiTableCell-head': {
      background: 'rgba(0, 0, 0, 0.1)',
      borderBottom: 'none',
    },
    // override text color of forms to be visible in theme background colors
    '.MuiFormLabel-root': {
      color: theme.palette.text.primary,
    },
    // text color of forms to distinguish them when focus
    '.MuiFormLabel-root.Mui-focused': {
      color: '#A8A8A8',
    },
  },
}))(() => null);
