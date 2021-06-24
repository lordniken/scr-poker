import React from 'react';
import { Typography } from '@material-ui/core';

interface IProps {
  title: string;
  onlineList: string[];
}

const GameField: React.FC<IProps> = ({ title, onlineList = [] }) => {
  console.log('game field');

  return (
    <>
      <Typography>{title}</Typography>
      {onlineList.map(user => <p key={user}>{user}</p>)}
    </>
  );
};

export default GameField;
