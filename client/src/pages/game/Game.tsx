import React from 'react';
import { useQuery } from '@apollo/client';
import { Header } from 'containers';
import { useGameIdSelector } from 'hooks';
import { FlexBox } from 'components';
import GameInfoQuery from './GameInfoQuery.graphql';
import Stories from './Stories';
import GameField from './GameField';

const Game: React.FC = () => {
  const gameId = useGameIdSelector();
  const { data : { gameInfo = {} } = {} } = useQuery(GameInfoQuery, {
    variables: {
      gameId,
    },
  });
  const { stories, isGameOwner } = gameInfo;

  console.log(gameInfo);

  return (
    <>
      <Header />
      <FlexBox padding={2} justifyContent="space-between">
        <GameField />
        <FlexBox flexDirection="column">
          <Stories stories={stories} isGameOwner={isGameOwner} />
        </FlexBox>
      </FlexBox>
    </>
  );
};

export default Game;
