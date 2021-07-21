import React from 'react';
import { useQuery } from '@apollo/client';
import { Typography } from '@material-ui/core';
import { FlexBox } from 'components';
import { useGameIdSelector } from 'hooks';
import { gameFieldStyles } from './styles';
import GameFieldOnlineList from './GameFieldOnlineList';
import GameFieldControls from './GameFieldControls';
import GameFieldResults from './GameFieldResults';
import GameInfoQuery from '../GameInfoQuery.graphql';

interface IProps {
  title: string;
}

const GameField: React.FC<IProps> = ({ title }) => {
  const styles = gameFieldStyles();
  const gameId = useGameIdSelector();
  const { data : { gameInfo = {} } = {} } = useQuery(GameInfoQuery, {
    variables: {
      gameId,
    },
  });
  const {
    status: { 
      votingStorieId = null, 
      isVotingStarted = false, 
      votedUsers = [],
    } = {}, 
    cards, 
    votedScore,
  } = gameInfo;

  return (
    <FlexBox 
      flexDirection="column" 
      alignItems="center"
      className={styles.root}
    >
      <FlexBox className={styles.main}>
        <Typography 
          className={styles.title} 
          variant="subtitle2"
        >
          {title}
        </Typography>
        <GameFieldOnlineList votedUsers={votedUsers} />
      </FlexBox>
      {isVotingStarted ? 
        <GameFieldControls 
          cards={cards} 
          isVotingStarted={isVotingStarted} 
          storieId={votingStorieId}
          votedCard={votedScore}
        /> :
        <GameFieldResults 
          votedUsers={votedUsers} 
          isVotingStarted={isVotingStarted} 
        />
      }
    </FlexBox>
  );
};

export default GameField;
