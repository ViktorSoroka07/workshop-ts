import { getUsername } from "@app/utils";
import { ShapeWithClassName, UserDto } from "@app/types";

type UserProps = ShapeWithClassName<Pick<UserDto, "firstName" | "lastName">>;

export const User = ({ firstName, lastName, className }: UserProps) => {
  // Dynamic import can help with optimization by loading heavy code (that not need everywhere) on demand
  // https://github.com/lannex/react-password-strength-bar
  import("./heavy").then((Module) => Module.work()).catch(console.error);

  return () =>
    `<div class="${className}">${getUsername({ firstName, lastName })}</div>`;
};
