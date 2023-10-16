import { None, Opt, Principal, Record, Some, nat64, text } from "azle";
import { generateId } from "../../../utilities/helpers";

export const Profile = Record({
  firstName: text,
  lastName: text,
  curp: text,
});

export const User = Record({
  id: Principal, // ICP Principal
  profile: Profile,
  patientProfile: Principal,
  // patientProfile: Opt(Principal),
  createdAt: nat64,
});

export type UserType = typeof User;
