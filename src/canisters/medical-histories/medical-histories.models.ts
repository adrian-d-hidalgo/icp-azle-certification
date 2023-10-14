import { Principal, Record, Vec, nat64, text } from "azle";

export const Diagnosis = Record({
  // TODO: Add doctor information
  date: nat64,
  description: text,
});

export const DrugPrescription = Record({
  name: text,
  form: text,
  dosage: text,
  frequency: text,
  duration: text,
});

export const Prescription = Record({
  // TODO: Add doctor information
  drugs: Vec(DrugPrescription),
  createdAt: nat64,
});

export const MedicalHistory = Record({
  id: Principal,
  patientId: Principal,
  diagnoses: Vec(Diagnosis),
  prescriptions: Vec(Prescription),
});

export type MedicalHistoryType = typeof MedicalHistory;
