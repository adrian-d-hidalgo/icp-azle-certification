import { Principal, Record, Vec, text } from "azle";

export const GetAllPatientsItemResponse = Record({
  id: Principal,
  firstName: text,
  lastName: text,
});

export const GetAllPatientsResponse = Vec(GetAllPatientsItemResponse);
