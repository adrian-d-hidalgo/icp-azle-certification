import { Principal, Record, Vec, nat64, text } from "azle";

export const DiagnosisSymptom = Record({
  description: text,
  startDate: nat64,
});

export type DiagnosisSymptomType = typeof DiagnosisSymptom;

export const DiagnosisNote = Record({
  description: text,
  createdAt: nat64,
});

export type DiagnosisNote = typeof DiagnosisNote;

export const Diagnosis = Record({
  id: Principal,
  description: text,
  symptoms: Vec(DiagnosisSymptom),
  treatmens: Vec(text),
  prescriptions: Vec(Principal),
  notes: Vec(DiagnosisNote),
  createdBy: Principal,
  createdAt: nat64,
});

export type DiagnosisType = typeof Diagnosis;

export const CardexItem = Record({});

export type CardexItemType = typeof CardexItem;

export const Cardex = Vec(CardexItem);

export type CardexType = typeof Cardex;

export const MedicalHisory = Record({
  diagnoses: Vec(Diagnosis),
  prescriptions: Vec(Principal),
});

export const PatientProfile = Record({
  id: Principal,
  cardex: Cardex,
  medicalHistory: MedicalHisory,
});

export type PatientProfileType = typeof PatientProfile;
