import React from 'react';
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { headerStyles } from './styles';

const Header: React.FC = () => {
  const styles = headerStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClose = React.useCallback(() => {
    setAnchorEl(null);
  }, []);
  const handleMenuOpen = React.useCallback(event => {
    setAnchorEl(event.currentTarget);
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={styles.title}>
          Dashboard
        </Typography>
        <div>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
            onClick={handleMenuOpen}
          >
            <AccountCircle />
          </IconButton>
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
        </div>
      </Toolbar>
    </AppBar>
  );};

export default Header;
