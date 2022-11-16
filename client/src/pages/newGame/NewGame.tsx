import React from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { 
  TextField as MaterialTextField, 
  Box, 
  Button, 
  Container, 
  FormControl, 
  FormControlLabel, 
  IconButton, 
  InputLabel, 
  List, 
  ListItem, 
  ListItemSecondaryAction, 
  ListItemText, 
  MenuItem, 
  Typography,
} from '@material-ui/core';
import { TextField, Select, CheckBox } from 'components';
import { yupResolver } from '@hookform/resolvers/yup';
import RemoveIcon from '@material-ui/icons/RemoveCircle';
import AddCircle from '@material-ui/icons/AddCircle';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { newGameStyles } from './styles';
import { newGameValidationSchema } from './validation';
import { DashboardStruct } from '../dashboard';
import NewGameMutation from './NewGameMutation.graphql';

interface IStorie {
  id: string;
  value: string;
};

interface IFormValues {
  gameName: string;
  votingSystem: string;
  allowSpectators: boolean;
  stories: string[];
};

const INITIAL_VALUES: IFormValues = {
  gameName: '',
  votingSystem: 'fibonacci',
  allowSpectators: false,
  stories: [],
};

const NewGame: React.FC = () => {
  const styles = newGameStyles();
  const history = useHistory();
  const [stories, setStory] = React.useState<IStorie[]>([]);
  const storieRef = React.useRef<HTMLInputElement>();
  const { handleSubmit, control, setValue, formState: { isValid } } = useForm({ 
    mode: 'onChange',
    defaultValues: INITIAL_VALUES,
    resolver: yupResolver(newGameValidationSchema),
  });
  const handleUsAdd = React.useCallback((e) => {
    if ((e.type === 'keydown' && e.keyCode === 13) || e.type === 'click') {
      e.preventDefault();
      if (!storieRef!.current!.value.trim()) {
        return;
      }
      setStory(prev => [...prev, {
        id: uuid(),
        value: storieRef!.current!.value,
      }]);
    }
  }, []);
  const handleUsRemove = React.useCallback(id => {
    setStory(stories.filter(us => us.id !== id));
  }, [stories]);
  const [createGame, { loading: createGameLoading }] = useMutation(NewGameMutation, {
    onCompleted: ({ createGame: { id } }) => {
      history.push(`/game/${id}`);
    },
  });
  const onSubmit = (values: IFormValues) => createGame({ variables: { data: values } });

  React.useEffect(() => {
    setValue('stories', stories.map(storie => storie.value), { shouldValidate: true });
    storieRef!.current!.value = '';
  }, [JSON.stringify(stories)]);
  
  return (
    <DashboardStruct>
      <Container maxWidth="sm" component="form" onSubmit={handleSubmit(onSubmit)} className={styles.container}>
        <Box paddingBottom={3}>
          <Typography variant="h5" align="center">Game options</Typography>
        </Box>
        <TextField name="gameName" label="Game name" control={control} fullWidth variant="outlined" />
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="demo-simple-select-outlined-label">Voting system</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            label="Voting system"
            name="votingSystem"
            control={control}
          >
            <MenuItem value="fibonacci">Fibonacci ( 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ? )</MenuItem>
            <MenuItem value="almostFibonacci">Almost Fibonacci (0, ½, 1, 2, 3, 5, 8, 13, 20, 40, 100, ?)</MenuItem>
            <MenuItem value="x2">x2 (0, 1, 2, 4, 8, 16, 32, 64, ?)</MenuItem>
            <MenuItem value="from0to10">From 0 to 10 (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ?)</MenuItem>
          </Select>
        </FormControl>
        <Box paddingTop={2}>
          <FormControlLabel
            value="end"
            control={<CheckBox color="primary" name="allowSpectators" control={control} />}
            label="Allow to join as spectator"
            labelPlacement="end"
          />
        </Box>
        <Box paddingY={2}>
          <List className={styles.list}>
            <Box className={styles.listItems}>
              {
                stories.map(({ id, value })=> (
                  <ListItem key={id} dense>
                    <ListItemText primary={value} />
                    <ListItemSecondaryAction>
                      <IconButton size="small" onClick={() => handleUsRemove(id)}>
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
              }
            </Box>
            <ListItem dense>
              <MaterialTextField 
                label="Type user story" 
                fullWidth 
                onKeyDown={handleUsAdd} 
                inputRef={storieRef}
                InputProps={{ endAdornment: (
                  <IconButton size="small" onClick={handleUsAdd} edge="end">
                    <AddCircle fontSize="small" />
                  </IconButton>),
                }}
              />
            </ListItem>
          </List>
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          type="submit"
          disabled={!isValid || createGameLoading}
          fullWidth
        >
          Start game
        </Button>
      </Container>
    </DashboardStruct>
  );
};

export default NewGame;
