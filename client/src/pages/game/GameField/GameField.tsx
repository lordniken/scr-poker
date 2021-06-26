import React from 'react';
import { Typography } from '@material-ui/core';
import { FlexBox, Card } from 'components';
import { gameFieldStyles } from './styles';

interface IProps {
  title: string;
  onlineList: IUser[];
  votedUsers: IVote[];
}

interface IUser {
  id: string;
  username: string;
}

interface IVote {
  userId: string;
  value: string;
}

const GameField: React.FC<IProps> = ({ children, title, onlineList = [], votedUsers = [] }) => {
  const styles = gameFieldStyles();

  return (
    <FlexBox 
      flexDirection="row" 
      flexWrap="wrap" 
      className={styles.container}
    >
      <FlexBox 
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        className={styles.table}
      >
        <FlexBox paddingBottom={2}>
          <Typography>{title}</Typography>
        </FlexBox>
        {children}
      </FlexBox>
      
      {onlineList.map((user: IUser, index) => {
        const votedUser = votedUsers?.find(vote => vote.userId === user.id);

        return (
          <FlexBox
            flexDirection="column"
            alignItems="center"
            key={user.id} 
            order={index % 2 ? '3' : '1'}
            className={styles.userCard}
          >
            <Card selected={!!votedUser} disabled>
              {votedUser?.value}
            </Card>
            <Typography variant="caption" className={styles.username}>{user.username}</Typography>
          </FlexBox>
        );
      })}
    </FlexBox>
  );
};

export default GameField;
