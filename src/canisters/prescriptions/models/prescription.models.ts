import { Principal, Record, Vec, nat64, text } from "azle";

export const PrescriptionDrug = Record({
  name: text,
  form: text,
  dosage: text,
  frequency: text,
  duration: text,
  indications: text, // TODO: Make it optional
});

export type PrescriptionDrugType = typeof PrescriptionDrug;

export const Prescription = Record({
  id: Principal,
  drugs: Vec(PrescriptionDrug),
  // createdBy: Principal, // TODO: Doctor Principal
  createdAt: nat64,
});

export type PrescriptionType = typeof Prescription;
