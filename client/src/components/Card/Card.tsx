import React from 'react';
import { ButtonBase, Typography } from '@material-ui/core';
import cn from 'classnames';
import { cardStyles } from './styles';

interface IProps extends React.ButtonHTMLAttributes<HTMLElement> {
  selected: boolean;
}

const Card: React.FC<IProps> = ({ children, selected, ...props }) => {
  const styles = cardStyles();

  return (
    <ButtonBase 
      {...props}
      className={cn(styles.card, { [styles.selected]: selected })}
    >
      <Typography variant="h6">{children}</Typography>
    </ButtonBase>
  );
};

export default Card;
