import { getUsername } from '@app/utils';
import type { ShapeWithClassName, UserDto } from '@app/types';

type UserProps = ShapeWithClassName<Pick<UserDto, 'firstName' | 'lastName'>>;

export const renderUser = ({ firstName, lastName, className }: UserProps) =>
  `<div class="${className}">${getUsername({ firstName, lastName })}</div>`;
