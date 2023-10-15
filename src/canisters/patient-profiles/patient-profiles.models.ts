import { Principal, Record, Vec, nat64, text } from "azle";

export const Diagnosis = Record({
  id: Principal,
  description: text,
  prescriptions: Vec(Principal),
  // createdBy: Principal, // TODO: Doctor Principal
  createdAt: nat64,
});

export const PatientProfile = Record({
  id: Principal,
  userId: Principal,
  diagnoses: Vec(Diagnosis),
  prescriptions: Vec(Principal),
});

export type PatientProfileType = typeof PatientProfile;
