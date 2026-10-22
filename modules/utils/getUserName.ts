import type { UserDto } from '@app/types';

export const getUsername = ({ firstName, lastName }: UserDto) =>
  `${firstName} ${lastName}`;
