import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { Container, Paper, Typography, Link, Button, Box } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import QueryString from 'query-string';
import { FlexBox, TextField } from 'components';
import { setValue } from 'utils';
import { authStyles } from './styles';
import { authValidationSchema } from './validation';
import BasicCreateUserMutation from './BasicAuthMutation.graphql';
import { AUTH } from '../../constants';

const INITIAL_VALUES = {
  username: '',
};

const Auth: React.FC = () => {
  const styles = authStyles();
  const { handleSubmit, control, formState: { errors, isValid } } = useForm({ 
    mode: 'onChange',
    defaultValues: INITIAL_VALUES,
    resolver: yupResolver(authValidationSchema),
  });
  const { search } = useLocation();
  const [createUser] = useMutation(BasicCreateUserMutation, {
    onCompleted: ({ createUser: userToken }) => {
      const { redirect } = QueryString.parse(search);

      setValue('scr-poker-token', userToken);
      window.location.href = String(redirect);
    },
  });
  const onSubmit = React.useCallback(({ username }: typeof INITIAL_VALUES) => 
    createUser({ variables: { username } }), [createUser]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  return (
    <Container maxWidth="sm" className={styles.root}>
      <Paper className={styles.paper}>
        <Container maxWidth="xs" component="form" onSubmit={handleSubmit(onSubmit)}>
          <FlexBox alignItems="center" flexDirection="column">
            <Typography variant="h1" align="center">Introduce yourself</Typography>
            <Box alignItems="center" flexDirection="column" className={styles.form}>
              <TextField
                name="username"
                label="Your name"
                variant="outlined"
                fullWidth
                className={styles.input}
                inputRef={inputRef}
                inputProps={{ maxLength: AUTH.MAX_LENGTH }}
                control={control}
                errors={errors}
              />
              <Button 
                variant="contained" 
                color="primary" 
                type="submit"
                disabled={!isValid}
                fullWidth
              >
                Login
              </Button>
            </Box>
            <Typography variant="body2">
              Also you can <Link>login</Link> or <Link>sign up</Link>
            </Typography>
          </FlexBox>
        </Container>        
      </Paper>
    </Container>
  );
};

export default Auth;
