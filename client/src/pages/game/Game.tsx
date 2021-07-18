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
import GameControls from './GameControls';
import GameResults from './GameResults';

const Game: React.FC = () => {
  useGameSubscriptions();
  const gameId = useGameIdSelector();
  const { data : { gameInfo = {} } = {}, loading } = useQuery(GameInfoQuery, {
    variables: {
      gameId,
    },
  });
  const { data : { stories = [] } = {} } = useQuery(GameStoriesQuery, {
    variables: {
      gameId,
    },
  });
  const { 
    isGameOwner, 
    status: { 
      votingStorieId = null, 
      isVotingStarted = false, 
      votedUsers = [],
    } = {}, 
    cards, 
    votedScore,
  } = gameInfo;
  const activeStorieTitle = React.useMemo(() => {
    const activeStorie = (stories as IStorie[]).find(storie => storie.id === votingStorieId);

    return activeStorie ? activeStorie.storieName : 'Waiting for the start...';
  }, [JSON.stringify(stories), votingStorieId]);  

  if (loading) {
    return null;
  }

  return (
    <FlexBox flexDirection="column" alignItems="center">
      <Header />
      <FlexBox 
        padding={2} 
        justifyContent="space-beetween" 
        marginBottom={10}
        width='100%'
      >
        <GameField title={activeStorieTitle} votedUsers={votedUsers}>
          <GameControls 
            cards={cards} 
            isVotingStarted={isVotingStarted} 
            storieId={votingStorieId}
            votedCard={votedScore}
          />
        </GameField>
        <FlexBox flexDirection="column" width={500}>
          <GameStories 
            isGameOwner={isGameOwner} 
            currentVotingStorie={votingStorieId} 
            isVotingStarted={isVotingStarted}
          />
        </FlexBox>
      </FlexBox>
      <GameResults votedUsers={votedUsers} isVotingStarted={isVotingStarted} />
    </FlexBox>
  );
};

export default Game;
