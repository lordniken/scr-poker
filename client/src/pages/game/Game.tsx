import React from 'react';
import { useQuery } from '@apollo/client';
import { Header } from 'containers';
import { useGameIdSelector } from 'hooks';
import { FlexBox } from 'components';
import GameInfoQuery from './GameInfoQuery.graphql';
import StoriesQuery from './Stories/StoriesQuery.graphql';
import Stories from './Stories';
import GameField from './GameField';
import { IStorie } from './Stories/Stories';
import useGameStatusChangedSubscription from './useGameStatusChangedSubscription';
import GameControls from './GameControls';

const Game: React.FC = () => {
  useGameStatusChangedSubscription();
  const gameId = useGameIdSelector();
  const { data : { gameInfo = {} } = {} } = useQuery(GameInfoQuery, {
    variables: {
      gameId,
    },
  });
  const { data : { stories = [] } = {} } = useQuery(StoriesQuery, {
    variables: {
      gameId,
    },
  });
  const { isGameOwner, status: { votingStorieId = null, isVotingStarted = false } = {}, cards } = gameInfo;
  const activeStorieTitle = React.useMemo(() => {
    const activeStorie = (stories as IStorie[]).find(storie => storie.id === votingStorieId);

    return activeStorie ? activeStorie.storieName : 'Waiting for start...';
  }, [JSON.stringify(stories), votingStorieId]);

  return (
    <FlexBox flexDirection="column" alignItems="center">
      <Header />
      <FlexBox 
        padding={2} 
        justifyContent="space-between" 
        width="100%"
        marginBottom={10}
      >
        <GameField title={activeStorieTitle} />
        <FlexBox flexDirection="column" width={400}>
          <Stories isGameOwner={isGameOwner} currentVotingStorie={votingStorieId} />
        </FlexBox>
      </FlexBox>
      <GameControls cards={cards} isVotingStarted={isVotingStarted} />
    </FlexBox>
  );
};

export default Game;
