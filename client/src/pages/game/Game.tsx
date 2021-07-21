import React from 'react';
import { useQuery } from '@apollo/client';
import { Header } from 'containers';
import { useGameIdSelector } from 'hooks';
import { FlexBox } from 'components';
import GameInfoQuery from './GameInfoQuery.graphql';
import GameStoriesQuery from './GameStories/GameStoriesQuery.graphql';
import GameStories from './GameStories';
import GameField from './GameField';
import { IStorie } from './GameStories/GameStories';
import useGameSubscriptions from './useGameSubscriptions';

const Game: React.FC = () => {
  useGameSubscriptions();
  const gameId = useGameIdSelector();
  const { data : { gameInfo = {} } = {}, loading } = useQuery(GameInfoQuery, {
    variables: {
      gameId,
    },
  });
  const { data : { stories = [] } = {}, loading: storiesLoading } = useQuery(GameStoriesQuery, {
    variables: {
      gameId,
    },
  });
  const { isGameOwner, status: { votingStorieId = null, isVotingStarted = false } = {} } = gameInfo;
  const activeStorieTitle = React.useMemo(() => {
    const activeStorie = (stories as IStorie[]).find(storie => storie.id === votingStorieId);

    return activeStorie ? activeStorie.storieName : 'Waiting for the start..';
  }, [JSON.stringify(stories), votingStorieId]);  

  if (loading || storiesLoading) {
    return null;
  }

  return (
    <FlexBox flexDirection="column" alignItems="center" height="100vh">
      <Header />
      <FlexBox width="100%" height="100%">
        <GameField title={activeStorieTitle} />  
        <GameStories 
          isGameOwner={isGameOwner} 
          currentVotingStorie={votingStorieId} 
          isVotingStarted={isVotingStarted}
        />
      </FlexBox>
    </FlexBox>
  );
};

export default Game;
