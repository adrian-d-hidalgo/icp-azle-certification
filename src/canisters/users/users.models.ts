import { Principal, Record, nat64, text } from "azle";

export const Profile = Record({
  firstName: text,
  lastName: text,
  curp: text,
});

export const User = Record({
  id: Principal, // ICP Principal
  profile: Profile,
  patientProfile: Principal,
  createdAt: nat64,
});
