export type UserDto = {
  firstName: string;
  lastName: string;
  age?: number;
};

export type ShapeWithClassName<P = Record<string, unknown>> = P & {
  className?: string;
};
