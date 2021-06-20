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

const Game: React.FC = () => {
  const gameId = useGameIdSelector();
  const { data : { gameInfo = {} } = {} } = useQuery(GameInfoQuery, {
    variables: {
      gameId,
    },
  });
  const { data : { stories = [] } = {}, loading } = useQuery(StoriesQuery, {
    variables: {
      gameId,
    },
  });
  const { isGameOwner, currentVotingStorie } = gameInfo;
  const activeStorieTitle = React.useMemo(() => {
    const activeStorie = (stories as IStorie[]).find(storie => storie.id === currentVotingStorie);

    return activeStorie ? activeStorie.storieName : 'Waiting for start...';
  }, [JSON.stringify(stories), currentVotingStorie]);
  
  return (
    <>
      <Header />
      <FlexBox padding={2} justifyContent="space-between">
        <GameField title={activeStorieTitle} />
        <FlexBox flexDirection="column" width={400}>
          <Stories isGameOwner={isGameOwner} currentVotingStorie={currentVotingStorie} />
        </FlexBox>
      </FlexBox>
    </>
  );
};

export default Game;
