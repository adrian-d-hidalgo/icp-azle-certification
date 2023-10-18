import { Principal, Variant, Void, text } from "azle";

export const UsersErrors = Variant({
  UserDoesNotExist: Principal,
  UserAlreadyExists: text,
  UserCouldNotBeCreated: text,
  UnexpectedError: text,
});
