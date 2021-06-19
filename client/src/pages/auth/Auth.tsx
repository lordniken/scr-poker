import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { Container, Paper, Typography, Link, Button, Box } from '@material-ui/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { FlexBox, TextField } from 'components';
import { setValue } from 'utils';
import { authStyles } from './styles';
import { authValidationSchema } from './validation';
import BasicCreateUserMutation from './BasicAuthMutation.graphql';

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
  const [createUser] = useMutation(BasicCreateUserMutation, {
    onCompleted: ({ createUser: userToken }) => {
      setValue('scr-poker-token', userToken);
      window.location.href = '/dashboard';
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
            <Typography variant="h1" align="center">Introduce yourself!</Typography>
            <Box alignItems="center" flexDirection="column" className={styles.form}>
              <TextField
                name="username"
                label="Your name"
                variant="outlined"
                fullWidth
                className={styles.input}
                inputRef={inputRef}
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
