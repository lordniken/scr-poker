import React from 'react';
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { useApolloClient } from '@apollo/client';
import { useLocation } from 'react-router-dom';
import { FlexBox } from 'components';
import { useGameIdSelector } from 'hooks';
import routes from 'global/router/routes';
import GameInfoQuery from 'pages/game/GameInfoQuery.graphql';
import { headerStyles } from './styles';
import MeQuery from '../Auth/MeQuery.graphql';

const Header: React.FC = () => {
  const { pathname } = useLocation();
  const gameId = useGameIdSelector();
  const styles = headerStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = React.useMemo(() => Boolean(anchorEl), [anchorEl]);
  const handleClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);
  const handleMenuOpen = React.useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);
  const client = useApolloClient();
  const { me: { username = '' } } = client.readQuery({
    query: MeQuery,
  });
  const gameInfoQuery = client.readQuery({
    query: GameInfoQuery,
    variables: {
      gameId,
    },
  });  
  const title = React.useMemo(() => {
    const basicTitle = routes.find(route => route.path === pathname)?.title || '';
    return gameId ? gameInfoQuery?.gameInfo?.gameName : basicTitle;
  }, [pathname, gameId, gameInfoQuery?.gameInfo?.gameName]);
  
  return (
    <AppBar position="static" className={styles.header}>
      <Toolbar>
        <Typography variant="h6" className={styles.title}>
          {title}
        </Typography>
        <FlexBox alignItems="center">
          <Typography className={styles.username}>{username}</Typography>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
            onClick={handleMenuOpen}
          >
            <AccountCircle />
          </IconButton>
          {
            /*
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              
              <MenuItem onClick={handleClose}>Выход</MenuItem>
              
            </Menu>
            */
          }
        </FlexBox>
      </Toolbar>
    </AppBar>
  );};

export default Header;
