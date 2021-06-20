import { registerEnumType } from '@nestjs/graphql';

enum UserRoleType {
  developer = 'developer',
  designer = 'designer',
}

registerEnumType(UserRoleType, {
  name: 'UserRoleType',
  description: 'variants of UserRoleType',
});

export { UserRoleType };
