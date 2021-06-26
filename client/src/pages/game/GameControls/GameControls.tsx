import React from 'react';
import { useMutation } from '@apollo/client';
import { Card, FlexBox } from 'components';
import { useGameIdSelector } from 'hooks';
import { gameControlsStyles } from './styles';
import GameControlsVoteMutation from './GameControlsVoteMutation.graphql';

interface IProps {
  cards: string[];
  storieId: string;
  isVotingStarted: boolean;
  votedCard: string;
}

const GameControls: React.FC<IProps> = ({ cards, storieId, isVotingStarted, votedCard }) => {
  const styles = gameControlsStyles();
  const gameId = useGameIdSelector();
  const [selectedCard, setSelectedCard] = React.useState<string | null>(null);
  const [vote] = useMutation(GameControlsVoteMutation);
  const onCardSelected = React.useCallback((value) => {
    setSelectedCard(prev => prev === value ? null : value);
    vote({
      variables: {
        data: {
          gameId,
          storieId,
          value,
        },
      },
    });
  }, [gameId, storieId]);

  React.useEffect(() => {
    if (isVotingStarted){
      setSelectedCard(votedCard);
    }
  }, [votedCard, isVotingStarted]);

  React.useEffect(() => {
    if (!isVotingStarted){
      setSelectedCard(null);
    }
  }, [isVotingStarted]);  

  return (
    <FlexBox 
      justifyContent="space-around"
      flexWrap="wrap"
      className={styles.container}
    >
      {
        cards && cards.map(card => {
          const isSelected = card === selectedCard;

          return (
            <FlexBox key={card} paddingX={0.5} paddingY={0.5}>
              <Card 
                disabled={!isVotingStarted}
                selected={isSelected}
                onClick={() => onCardSelected(card)}
              >
                {card}
              </Card>
            </FlexBox>
          );
        })
      }
    </FlexBox>
  );
};

export default GameControls;
