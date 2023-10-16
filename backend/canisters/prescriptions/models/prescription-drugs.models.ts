import { Record, nat8, text } from "azle";

export const PrescriptionDrugFrequency = Record({
  qyantity: nat8,
  unit: text, // minutes, hours, days, weeks, months, years etc
});

export type PrescriptionDrugFrequencyType = typeof PrescriptionDrugFrequency;

export const PrescriptionDrugDosage = Record({
  quantity: nat8,
  unit: text, // mg, lt, etc
});

export type PrescriptionDrugDosageType = typeof PrescriptionDrugDosage;

export const PrescriptionDrugDuration = Record({
  quantity: nat8,
  unit: text, // mg, lt, etc
});

export type PrescriptionDrugDurationType = typeof PrescriptionDrugDuration;

export const PrescriptionDrug = Record({
  name: text,
  form: text, // TODO: Define options for types and routes
  dosage: PrescriptionDrugDosage,
  frequency: PrescriptionDrugFrequency,
  duration: PrescriptionDrugDuration,
  indications: text, // TODO: Make it optional
});

export type PrescriptionDrugType = typeof PrescriptionDrug;
