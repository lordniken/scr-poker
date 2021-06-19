import React from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';
import { routes } from 'global/router';
import { sidebarStyles } from './styles';

const Sidebar: React.FC = () => {
  const styles = sidebarStyles();
  const { pathname } = useLocation();  

  return (
    <List component="nav" className={styles.root}>
      {
        routes.map(({ title, path }) => title && (
          <ListItem key={path} button component={Link} to={path} selected={pathname === path}>
            <ListItemText primary={title} />
          </ListItem>
        ))
      }
    </List>
  );
};

export default Sidebar;
