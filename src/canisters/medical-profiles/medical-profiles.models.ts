import { Principal, Record, Vec, nat64, text } from "azle";

export const DrugPrescription = Record({
  name: text,
  form: text,
  dosage: text,
  frequency: text,
  duration: text,
  indications: text, // TODO: Make it optional
});

export const Prescription = Record({
  id: Principal,
  drugs: Vec(DrugPrescription),
  // createdBy: Principal, // TODO: Doctor Principal
  createdAt: nat64,
});

export const Diagnosis = Record({
  id: Principal,
  description: text,
  prescriptions: Vec(Prescription),
  // createdBy: Principal, // TODO: Doctor Principal
  createdAt: nat64,
});

export const MedicalProfile = Record({
  id: Principal,
  patientId: Principal,
  diagnoses: Vec(Diagnosis),
  prescriptions: Vec(Prescription),
});

export type MedicalProfileType = typeof MedicalProfile;
