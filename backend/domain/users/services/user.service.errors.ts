export class UserAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserAlreadyExistsError";
  }
}

export class UserCouldNotBeCreatedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserCouldNotBeCreatedError";
  }
}

export class UserDoesNotExistError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserDoesNotExistError";
  }
}

export class UserPatientProfileDoesNotExist extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserPatientProfileDoesNotExist";
  }
}
