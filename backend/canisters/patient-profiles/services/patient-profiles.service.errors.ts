import { Principal, Variant } from "azle";

export const PatientProfilesErrors = Variant({
  PatientProfileDoesNotExist: Principal,
  PatientProfileDoesNotExistForPatient: Principal,
});
