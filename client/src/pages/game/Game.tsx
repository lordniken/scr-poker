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

const Game: React.FC = () => {
  useGameSubscriptions();
  const gameId = useGameIdSelector();
  const { data : { gameInfo = {} } = {} } = useQuery(GameInfoQuery, {
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
    onlineList,
  } = gameInfo;
  const activeStorieTitle = React.useMemo(() => {
    const activeStorie = (stories as IStorie[]).find(storie => storie.id === votingStorieId);

    return activeStorie ? activeStorie.storieName : 'Waiting for start...';
  }, [JSON.stringify(stories), votingStorieId]);

  return (
    <FlexBox flexDirection="column" alignItems="center">
      <Header />
      <FlexBox 
        padding={2} 
        justifyContent="space-beetween" 
        marginBottom={10}
        width='100%'
      >
        <GameField title={activeStorieTitle} onlineList={onlineList} votedUsers={votedUsers} />
        <FlexBox flexDirection="column" width={400}>
          <GameStories 
            isGameOwner={isGameOwner} 
            currentVotingStorie={votingStorieId} 
            isVotingStarted={isVotingStarted}
          />
        </FlexBox>
      </FlexBox>
      <GameControls 
        cards={cards} 
        isVotingStarted={isVotingStarted} 
        storieId={votingStorieId}
        votedCard={votedScore}
      />
    </FlexBox>
  );
};
// <GameField title={activeStorieTitle} onlineList={onlineList} />
export default Game;
