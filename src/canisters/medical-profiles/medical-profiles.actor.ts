import {
  Canister,
  Err,
  Ok,
  Principal,
  Result,
  StableBTreeMap,
  Vec,
  Void,
  query,
  update,
} from "azle";
import { MedicalProfile, MedicalProfileType } from "./medical-profiles.models";
import { generateId } from "../../utilities/helpers";
import { MedicalProfileErrors } from "./medical-profiles.errors";

let medicalProfiles = StableBTreeMap(Principal, MedicalProfile, 0);

export default Canister({
  create: update([Principal], MedicalProfile, (patientId) => {
    const id = generateId();
    const medicalProfile: MedicalProfileType = {
      id,
      patientId,
      diagnoses: [],
      prescriptions: [],
    };

    medicalProfiles.insert(id, medicalProfile);

    return medicalProfile;
  }),

  delete: update([Principal], Void, (id) => {
    medicalProfiles.remove(id);
  }),

  getAll: query([], Vec(MedicalProfile), () => {
    return medicalProfiles.values();
  }),

  getByPatient: query(
    [Principal],
    Result(MedicalProfile, MedicalProfileErrors),
    (patientId) => {
      const profiles = medicalProfiles.values();
      const profile = profiles.find(
        (p) => p.patientId.toText() === patientId.toText()
      );

      if (profile) return Ok(profile);

      return Err({
        MedicalProfileDoesNotExistForPatient: patientId,
      });
    }
  ),
});
