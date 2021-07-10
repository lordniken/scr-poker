import React from 'react';
import { Box } from '@material-ui/core';
import { verticalProgressStyles } from './styles';

export interface IProps {
  progress: number;
}

const VerticalProgress:React.FC<IProps> = (props) => {
  const styles = verticalProgressStyles(props);

  return (
    <Box className={styles.root} />
  );
};

export default VerticalProgress;
