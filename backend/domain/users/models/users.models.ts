import { Opt, Principal, Record, nat64, text } from "azle";

export const Profile = Record({
  firstName: text,
  lastName: text,
  curp: text,
});

export type ProfileType = typeof Profile;

export const User = Record({
  id: Principal, // ICP Principal
  profile: Profile,
  patientProfile: Principal,
  doctorProfile: Opt(Principal),
  createdAt: nat64,
});

export type UserType = typeof User;
