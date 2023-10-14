import { Principal, Record, Vec, nat64, text } from "azle";

export const Diagnosis = Record({
  id: Principal,
  description: text,
  prescriptions: Vec(Principal),
  // createdBy: Principal, // TODO: Doctor Principal
  createdAt: nat64,
});

export const MedicalProfile = Record({
  id: Principal,
  patientId: Principal,
  diagnoses: Vec(Diagnosis),
  prescriptions: Vec(Principal),
});

export type MedicalProfileType = typeof MedicalProfile;
