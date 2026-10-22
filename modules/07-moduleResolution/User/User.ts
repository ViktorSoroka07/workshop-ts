import { getUsername } from '@app/utils';
import type { ShapeWithClassName, UserDto } from '@app/types';

type UserProps = ShapeWithClassName<Pick<UserDto, 'firstName' | 'lastName'>>;

export const User = ({ firstName, lastName, className }: UserProps) => {
  // Dynamic import loads heavy code on demand — only when this component renders.
  // See 05-dynamicImports.ts for the full explanation of this pattern.
  // Real-world use case: https://github.com/lannex/react-password-strength-bar
  import('./heavy').then((Module) => Module.work()).catch(console.error);

  return () =>
    `<div class="${className}">${getUsername({ firstName, lastName })}</div>`;
};
