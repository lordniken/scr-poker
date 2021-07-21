import React from 'react';
import { Button, Container, List, ListItem, Typography } from '@material-ui/core';
import { useMutation, useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import cn from 'classnames';
import { FlexBox } from 'components';
import { useGameIdSelector } from 'hooks';
import GameStoriesQuery from './GameStoriesQuery.graphql';
import ChangeGameStatusMutation from './ChangeGameStatusMutation.graphql';
import { storieValidationSchema } from './validation';
import { gameStoriesStyles } from './styles';

interface IProps {
  isGameOwner: boolean;
  currentVotingStorie: string;
  isVotingStarted: boolean;
}

export interface IStorie {
  id: string;
  storieName: string;
  isVoted: boolean;
}

const INITIAL_VALUES = {
  storieId: '',
};

const Stories: React.FC<IProps> = ({ isGameOwner, currentVotingStorie, isVotingStarted }) => {
  const gameId = useGameIdSelector();
  const styles = gameStoriesStyles();
  const [selectedStorie, setSelectedStorie] = React.useState<string>('');
  const { data : { stories = [] } = {}, loading } = useQuery(GameStoriesQuery, {
    variables: {
      gameId,
    },
  });
  const { handleSubmit, setValue, formState: { isValid } } = useForm({ 
    mode: 'onChange',
    defaultValues: INITIAL_VALUES,
    resolver: yupResolver(storieValidationSchema),
  });
  const [changeGameStatus] = useMutation(ChangeGameStatusMutation);
  const onSubmit = ({ storieId }: typeof INITIAL_VALUES) => {
    changeGameStatus({
      variables: {
        data: {
          gameId,
          storieId,
        },
      },
    });
  };

  React.useEffect(() => {
    setValue('storieId', selectedStorie, { shouldValidate: true });
  }, [selectedStorie, setValue]);

  React.useEffect(() => {
    setSelectedStorie(currentVotingStorie);
  }, [currentVotingStorie]);

  return (
    <FlexBox 
      flexDirection="column" 
      alignItems="center"
      className={styles.root}
    >
      <Typography variant="subtitle2">Stories list</Typography>
      <Container 
        maxWidth="sm" 
        component="form" 
        onSubmit={handleSubmit(onSubmit)}
      >
        <List>
          {
            (stories && !loading) && stories.map((storie: IStorie) => 
              <ListItem 
                key={storie.id} 
                button 
                onClick={() => setSelectedStorie(storie.id)}
                selected={isVotingStarted ? storie.id === currentVotingStorie : selectedStorie === storie.id}
                disabled={isVotingStarted && isGameOwner}
              >
                <Typography 
                  variant="body2"
                  className={
                    cn({ [styles.completedStory]: storie.isVoted })
                  }
                >
                  {storie.storieName}
                </Typography>
              </ListItem>,
            )
          }
          
        </List>
        { 
          isGameOwner && (
            <Button
              variant="contained" 
              color={isVotingStarted ? 'secondary' : 'primary'}
              type="submit"
              fullWidth
              disabled={!isValid}
            >
              {isVotingStarted ? 'Show cards' : 'Start new round'}
            </Button>
          )
        }
      </Container>
    </FlexBox>
  );
};

export default Stories;
