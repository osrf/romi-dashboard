import { makeStyles } from '@material-ui/core';

export const usePageStyles = makeStyles((theme) => ({
  pageRoot: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing(4),
    maxWidth: 1000,
    width: '100%',
  },
}));
