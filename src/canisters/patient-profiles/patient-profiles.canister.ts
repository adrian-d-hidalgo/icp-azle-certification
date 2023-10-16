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
} from "./patient-profiles.models";
import { generateId } from "../../utilities/helpers";
import { PatientProfilesErrors } from "./patient-profiles.errors";
import { PrescriptionDrug } from "../prescriptions/prescription.models";
import { PrescriptionCaller } from "../prescriptions/prescription.caller";

let profiles = StableBTreeMap(Principal, PatientProfile, 0);

export default Canister({
  create: update([], PatientProfile, () => {
    const id = generateId();
    const profile: PatientProfileType = {
      id,
      diagnoses: [],
      prescriptions: [],
    };

    profiles.insert(id, profile);

    return profile;
  }),

  addDiagnosis: update(
    [Principal, text, Vec(PrescriptionDrug)],
    Result(Diagnosis, PatientProfilesErrors),
    async (profileId, description, drugs) => {
      const profileOpt = profiles.get(profileId);

      if ("None" in profileOpt) {
        return Err({
          PatientProfileDoesNotExist: profileId,
        });
      }

      const prescriptionCanister = new PrescriptionCaller();
      const prescription = await prescriptionCanister.create(drugs);

      const id = generateId();

      const diagnosis: typeof Diagnosis = {
        id,
        description,
        prescriptions: prescription ? [prescription.id] : [],
        createdAt: ic.time(),
      };

      const profile = profileOpt.Some;
      profile.diagnoses.push(diagnosis);

      profiles.insert(profile.id, profile);

      return Ok(diagnosis);
    }
  ),

  delete: update([Principal], Void, (id) => {
    profiles.remove(id);
  }),

  get: query(
    [Principal],
    Result(PatientProfile, PatientProfilesErrors),
    (profileId) => {
      const profileOpt = profiles.get(profileId);

      if ("None" in profileOpt) {
        return Err({
          PatientProfileDoesNotExist: profileId,
        });
      }

      const profile = profileOpt.Some;

      return Ok(profile);
    }
  ),

  getAll: query([], Vec(PatientProfile), () => {
    return profiles.values();
  }),
});
