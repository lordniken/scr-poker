import React from 'react';
import { Container, Paper, TextField, Typography, Link } from '@material-ui/core';
import { FlexBox } from 'components';
import { authStyles } from './styles';

const Auth: React.FC = () => {
  const styles = authStyles();

  return (
    <Container maxWidth="sm" className={styles.root}>
      <Paper className={styles.paper}>
        <Container maxWidth="xs">
          <FlexBox alignItems="center" flexDirection="column">
            <Typography variant="h1">Introduce yourself!</Typography>
            <TextField
              label="Your name"
              variant="outlined"
              className={styles.input}
              required
              fullWidth
            />
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
