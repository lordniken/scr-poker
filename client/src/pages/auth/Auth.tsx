import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Container, Paper, TextField, Typography, Link, Button, Box } from '@material-ui/core';
import { FlexBox } from 'components';
import { authStyles } from './styles';

const Auth: React.FC = () => {
  const styles = authStyles();
  const { handleSubmit, control } = useForm();
  const onSubmit = (data: any) => alert(JSON.stringify(data));

  return (
    <Container maxWidth="sm" className={styles.root}>
      <Paper className={styles.paper}>
        <Container maxWidth="xs" component="form" onSubmit={handleSubmit(onSubmit)}>
          <FlexBox alignItems="center" flexDirection="column">
            <Typography variant="h1" align="center">Introduce yourself!</Typography>
            
            <Box alignItems="center" flexDirection="column" className={styles.form}>
              <Controller
                render={
                  ({ field }) => (
                    <TextField
                      label="Your name"
                      variant="outlined"
                      required
                      fullWidth
                      className={styles.input}
                      {...field}
                    />
                  )
                }
                control={control}
                name="name"
              />
              <Button variant="contained" color="primary" type="submit" fullWidth>Login</Button>
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
