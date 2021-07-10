import React from 'react';
import LinearProgress, { LinearProgressProps } from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

export function LinearProgressBar(props: LinearProgressProps & { value: number }): JSX.Element {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress color="secondary" variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2">{`${Math.floor(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}
