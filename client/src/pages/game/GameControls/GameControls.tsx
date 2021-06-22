import React from 'react';
import { Card, FlexBox } from 'components';
import { gameControlsStyles } from './styles';

interface IProps {
  cards: string[];
  isVotingStarted: boolean;
}

const GameControls: React.FC<IProps> = ({ cards, isVotingStarted }) => {
  const [selectedCard, setSelectedCard] = React.useState<string | null>(null);
  const styles = gameControlsStyles();
  const onCardSelected = React.useCallback((card) => {
    setSelectedCard(prev => prev === card ? null : card)
  }, []);

  return (
    <FlexBox 
      justifyContent="space-around" 
      className={styles.container}
    >
      {
        cards && cards.map(card => {
          const isSelected = selectedCard === card;

          return (
            <Card 
              key={card} 
              disabled={!isVotingStarted}
              selected={isSelected}
              onClick={() => onCardSelected(card)}
            >
              {card}
            </Card>
          )
        })
      }
    </FlexBox>
  );
};

export default GameControls;
