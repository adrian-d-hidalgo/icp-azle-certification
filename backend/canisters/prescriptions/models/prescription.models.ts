import { Principal, Record, Vec, nat64, text } from "azle";
import { PrescriptionDrug } from "./prescription-drugs.models";

export const Prescription = Record({
  id: Principal,
  patient: Principal,
  doctor: Principal,
  drugs: Vec(PrescriptionDrug),
  notes: text,
  createdAt: nat64,
});

export type PrescriptionType = typeof Prescription;
