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

// Medical History
export const MedicalHistory = Record({
  diagnoses: Vec(Diagnosis),
  prescriptions: Vec(Prescription),
});

export const Patient = Record({
  id: Principal,
  firstName: text,
  lastName: text,
  curp: text,
  //   birthday: int,
  createdAt: nat64,
  medicalHistory: MedicalHistory,
});
