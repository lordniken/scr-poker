import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { Card, FlexBox } from 'components';
import { IVote } from '../GameField/GameField';

interface IProps {
  votedUsers: IVote[];
  isVotingStarted: boolean;
}

interface IResultVote {
  value: string;
  count: number;
}

const getAverageScore = (storieVotes: IVote[]) => {
  const normalizedVotes = storieVotes.map((vote) => 
    typeof vote.value === 'string' ? 
      { ...vote, value: vote.value.replace('½', '0.5') } 
      : vote,
  );
  const votes = normalizedVotes.filter((vote) => Number(vote.value));
  const votesSum = votes.reduce((acc, vote) => acc + Number(vote.value), 0);

  return Math.floor(votesSum / votes.length * 100) / 100 || 0;
};

const GameResults:React.FC<IProps> = ({ votedUsers, isVotingStarted }) => {
  const [averageScore, setAverageScore] = React.useState<number>(0);
  const [valueStats, setValueStats] = React.useState<IResultVote[]>([]);

  React.useEffect(() => {
    if (!isVotingStarted && votedUsers?.length > 0) {
      const calcAverageScore = getAverageScore(votedUsers);

      setAverageScore(calcAverageScore);

      const uniqueVoteValues = Array.from(new Set(votedUsers.map(vote => vote.value))).sort();
      uniqueVoteValues.forEach(value => {
        const votesCount = votedUsers.filter(vote => value === vote.value)?.length;
        setValueStats(prev => ([
          ...prev,
          {
            value,
            count: votesCount,
          },
        ]));
      });
    }
  }, [JSON.stringify(votedUsers), isVotingStarted]);

  React.useEffect(() => {
    if (isVotingStarted) {
      setAverageScore(0);
      setValueStats([]);
    }
  }, [isVotingStarted]);

  if (isVotingStarted || !valueStats.length) {
    return null;
  }

  return (
    <>
      <Box>
        <Typography display="inline">Average score:&nbsp;</Typography>
        <Typography display="inline" variant="h6">{averageScore}</Typography>
      </Box>
      <FlexBox>
        {
          valueStats && valueStats.map(vote => (
            <FlexBox
              key={vote.value} 
              flexDirection="column" 
              alignItems="center"
              padding={1}
            >
              <Card selected={false} >{vote.value}</Card>
              <Typography>{vote.count} vote</Typography>
            </FlexBox>
          ))
        }
      </FlexBox>
    </>
  );
};

export default GameResults;
