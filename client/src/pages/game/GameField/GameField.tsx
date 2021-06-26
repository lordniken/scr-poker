import React from 'react';
import { Typography } from '@material-ui/core';
import { FlexBox, Card } from 'components';
import { gameFieldStyles } from './styles';

interface IProps {
  title: string;
  onlineList: IUser[];
}

interface IUser {
  id: string;
  username: string;
}

const GameField: React.FC<IProps> = ({ children, title, onlineList = [] }) => {
  const styles = gameFieldStyles();
  // onlineList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];

  return (
    <FlexBox 
      flexDirection="row" 
      flexWrap="wrap" 
      className={styles.container}
    >
      <FlexBox 
        alignItems="center"
        justifyContent="center"
        className={styles.table}
      >
        <Typography align="center">{title}</Typography>
      </FlexBox>
      
      {onlineList.map((user: IUser, index) => (
        <FlexBox
          flexDirection="column"
          alignItems="center"
          key={user.id} 
          order={index % 2 ? '3' : '1'}
          className={styles.userCard}
        >
          <Card selected={false} disabled />
          <Typography variant="caption" className={styles.username}>{user.username}</Typography>
        </FlexBox>
      ))}
      {children}
    </FlexBox>
  );
};

export default GameField;
