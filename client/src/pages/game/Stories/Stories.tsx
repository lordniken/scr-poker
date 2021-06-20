import React from 'react';
import { v4 as uuid } from 'uuid';
import { Button, List, ListItem, Typography } from '@material-ui/core';
import { FlexBox } from 'components';

interface IProps {
  stories: string[];
  isGameOwner: boolean;
}

const Stories: React.FC<IProps> = ({ stories, isGameOwner }) => {
  console.log('stories', stories);

  return (
    <FlexBox flexDirection="column" alignItems="center">
      <Typography>Stories list</Typography>
      <List>
        {
          stories && stories.map(storie => 
            <ListItem key={uuid()} button selected>
              {storie}
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
          >
            Start new round
          </Button>
        )
      }
    </FlexBox>
  );
};

export default Stories;
