import { Principal, Variant } from "azle";

export const PatientsError = Variant({
  PatientDoesNotExist: Principal,
});
