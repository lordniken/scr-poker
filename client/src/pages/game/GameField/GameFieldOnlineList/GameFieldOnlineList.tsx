import React from 'react';
import { useQuery } from '@apollo/client';
import { Typography } from '@material-ui/core';
import { useGameIdSelector } from 'hooks';
import { FlexBox, Card } from 'components';
import { gameFieldOnlineListStyles } from './styles';
import GameFieldOnlineListQuery from './GameFieldOnlineListQuery.graphql';

interface IProps {
  votedUsers: IVote[];
}

interface IUser {
  id: string;
  username: string;
}

export interface IVote {
  userId: string;
  value: string;
}

const GameFieldOnlineList: React.FC<IProps> = ({ votedUsers = [] }) => {
  const styles = gameFieldOnlineListStyles();
  const gameId = useGameIdSelector();
  const { data: { onlineList = [] } = {} } = useQuery(GameFieldOnlineListQuery, {
    variables: {
      gameId,
    },
  });

  return (
    <FlexBox className={styles.root}>
      {onlineList.map((user: IUser) => {
        const votedUser = votedUsers?.find(vote => vote.userId === user.id);

        return (
          <FlexBox
            key={user.id} 
            flexDirection="column"
            className={styles.userCard}
          >
            <Card selected={Boolean(votedUser)} disabled>
              {votedUser?.value}
            </Card>
            <Typography variant="caption" className={styles.username}>{user.username}</Typography>
          </FlexBox>
        );
      })}
    </FlexBox>
  );
};

export default GameFieldOnlineList;
