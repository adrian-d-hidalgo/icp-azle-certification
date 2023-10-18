import { ic } from "azle";

export class AuthGuardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthAccessError";
  }
}

export function AuthGuard() {
  const hasAccess = !ic.caller().isAnonymous();

  if (!hasAccess) {
    throw new AuthGuardError("You have to log in to access this resource");
  }
}
