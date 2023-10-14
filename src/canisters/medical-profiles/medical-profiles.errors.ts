import { Principal, Variant } from "azle";

export const MedicalProfileErrors = Variant({
  MedicalProfileDoesNotExist: Principal,
  MedicalProfileDoesNotExistForPatient: Principal,
});
