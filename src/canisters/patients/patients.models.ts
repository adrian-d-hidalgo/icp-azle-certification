import { Principal, Record, Vec, nat64, text } from "azle";

export const Patient = Record({
  id: Principal,
  firstName: text,
  lastName: text,
  curp: text,
  createdAt: nat64,
  medicalProfile: Principal,
});
