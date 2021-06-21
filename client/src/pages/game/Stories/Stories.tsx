import React from 'react';
import { Button, Container, List, ListItem, Typography } from '@material-ui/core';
import { useMutation, useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { FlexBox } from 'components';
import { useGameIdSelector } from 'hooks';
import StoriesQuery from './StoriesQuery.graphql';
import ChangeGameStatusMutation from './ChangeGameStatusMutation.graphql';
import { storieValidationSchema } from './validation';

interface IProps {
  isGameOwner: boolean;
  currentVotingStorie: string;
}

enum StorieStatus {
  unvoted = 'unvoted',
  voting = 'voting',
  voted = 'voted',
}

export interface IStorie {
  id: string;
  storieName: string;
  status: StorieStatus;
}

const INITIAL_VALUES = {
  storieId: '',
};

const Stories: React.FC<IProps> = ({ isGameOwner, currentVotingStorie }) => {
  const gameId = useGameIdSelector();
  const [selectedStorie, setSelectedStorie] = React.useState<string>('');
  const { data : { stories = [] } = {}, loading } = useQuery(StoriesQuery, {
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
  const isVoting = React.useMemo(() => Boolean(currentVotingStorie), [currentVotingStorie]);
  const buttonTitle = React.useMemo(() => 
    isVoting ? 'Stop voting' : 'Start new round', [isVoting]);

  React.useEffect(() => {
    setValue('storieId', currentVotingStorie ?? selectedStorie, { shouldValidate: true });
  }, [selectedStorie, setValue, currentVotingStorie]);

  return (
    <FlexBox flexDirection="column" alignItems="center">
      <Typography>Stories list</Typography>
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
                selected={currentVotingStorie ? storie.id === currentVotingStorie : selectedStorie === storie.id}
                disabled={isVoting && isGameOwner}
              >
                <Typography>{storie.storieName}</Typography>
              </ListItem>,
            )
          }
          
        </List>
        { 
          isGameOwner && (
            <Button
              variant="contained" 
              color="primary" 
              type="submit"
              fullWidth
              disabled={!isValid}
            >
              {buttonTitle}
            </Button>
          )
        }
      </Container>
    </FlexBox>
  );
};

export default Stories;
