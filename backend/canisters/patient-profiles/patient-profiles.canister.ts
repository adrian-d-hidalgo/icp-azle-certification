import { Canister, Principal, Result, Vec, query, text, update } from "azle";
import {
  Diagnosis,
  DiagnosisSymptom,
  PatientProfile,
} from "./models/patient-profiles.models";
import { PatientProfilesErrors } from "./services/patient-profiles.service.errors";
import { PatientProfilesService } from "./services/patient-profiles.service";

const patientProfilesService = new PatientProfilesService();

export default Canister({
  create: update([], PatientProfile, () => {
    return patientProfilesService.create();
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
    [Principal, text, Vec(DiagnosisSymptom), Vec(text), Principal],
    Result(Diagnosis, PatientProfilesErrors),
    async (profileId, description, symptoms, treatmens, createdBy) => {
      return patientProfilesService.addDiagnosis(
        profileId,
        createdBy, // TODO: The caller only can create diagnosis, validate if caller exists
        description,
        symptoms,
        treatmens
      );
    }
  ),

  // getAllDiagnoses: query(
  //   [Principal],
  //   Result(Vec(Diagnosis), PatientProfilesErrors),
  //   (profileId) => {
  //     return patientProfilesService.getAllDiagnoses(profileId);
  //   }
  // ),
});
