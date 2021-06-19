import React from 'react';
import { Divider, List, ListItem, ListItemText } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { sidebarStyles } from './styles';

const Sidebar: React.FC = () => {
  const styles = sidebarStyles();

  return (
    <List component="nav" className={styles.root}>
      <ListItem button component={Link} to="/dashboard/new-game">
        <ListItemText primary="New game" />
      </ListItem>
      <ListItem button disabled>
        <ListItemText primary="Game history" />
      </ListItem>
      <Divider />
      <ListItem button disabled>
        <ListItemText primary="Manage team" />
      </ListItem>      
    </List>
  );
};

export default Sidebar;
