import React from 'react';
import { Box, BoxProps } from '@material-ui/core';

interface IProps extends BoxProps {
  display?: 'flex' | 'inline-flex';
  component?: React.ElementType;
}

const FlexBox: React.FC<IProps> = (
  { 
    display = 'flex',
    children, 
    ...rest
  }
) => (
  <Box 
    display={display}
    {...rest}
  >
    {children}
  </Box>
);

export default FlexBox;
