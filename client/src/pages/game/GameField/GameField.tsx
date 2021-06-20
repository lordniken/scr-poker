import React from 'react';

interface IProps {
  title: string;
}

const GameField: React.FC<IProps> = ({ title }) => {
  console.log('game field');

  return (
    <p>{title}</p>
  );
};

export default GameField;
