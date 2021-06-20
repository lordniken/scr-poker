import { registerEnumType } from '@nestjs/graphql';

enum StorieStatusType {
  unvoted = 'unvoted',
  voting = 'voting',
  voted = 'voted',
}

registerEnumType(StorieStatusType, {
  name: 'StorieStatusType',
  description: 'variants of StorieStatusType',
});

export { StorieStatusType };
