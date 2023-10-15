import { Principal, Record, Vec, text } from "azle";

export const GetAllUsersItemProfileResponse = Record({
  firstName: text,
  lastName: text,
});

export const GetAllUsersItemResponse = Record({
  id: Principal,
  profile: GetAllUsersItemProfileResponse,
});

export const GetAllUsersResponse = Vec(GetAllUsersItemResponse);
