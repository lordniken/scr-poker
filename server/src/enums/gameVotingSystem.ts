import { registerEnumType } from '@nestjs/graphql';

enum GameVotingSystemType {
  fibonacci = 'fibonacci',
  x2 = 'x2',
}

registerEnumType(GameVotingSystemType, {
  name: 'GameVotingSystemType',
  description: 'variants of GameVotingSystemType',
});

export { GameVotingSystemType };
