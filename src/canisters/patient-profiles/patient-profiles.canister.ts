import {
  Canister,
  Err,
  Ok,
  Principal,
  Result,
  StableBTreeMap,
  Vec,
  Void,
  ic,
  query,
  text,
  update,
} from "azle";
import {
  Diagnosis,
  PatientProfile,
  PatientProfileType,
} from "./models/patient-profiles.models";
import { generateId } from "../../utilities/helpers";
import { PatientProfilesErrors } from "./services/patient-profiles.service.errors";
import { PrescriptionDrug } from "../prescriptions/models/prescription.models";
import { PrescriptionCaller } from "../prescriptions/prescriptions.caller";
import { PatientProfilesService } from "./services/patient-profiles.service";

const patientProfilesService = new PatientProfilesService();

export default Canister({
  create: update([], PatientProfile, () => {
    const profile = patientProfilesService.create();
    return profile;
  }),

  get: query(
    [Principal],
    Result(PatientProfile, PatientProfilesErrors),
    (profileId) => {
      return patientProfilesService.get(profileId);
    }
  ),

  getAll: query([], Vec(PatientProfile), () => {
    return patientProfilesService.getAll();
  }),

  addDiagnosis: update(
    [Principal, text, Vec(PrescriptionDrug)],
    Result(Diagnosis, PatientProfilesErrors),
    async (profileId, description, drugs) => {
      return patientProfilesService.addDiagnosis(profileId, description, drugs);
    }
  ),
});
