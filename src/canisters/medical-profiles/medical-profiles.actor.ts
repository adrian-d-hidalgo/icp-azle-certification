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
  DrugPrescription,
  MedicalProfile,
  MedicalProfileType,
  Prescription,
} from "./medical-profiles.models";
import { generateId } from "../../utilities/helpers";
import { MedicalProfileErrors } from "./medical-profiles.errors";

let medicalProfiles = StableBTreeMap(Principal, MedicalProfile, 0);

export default Canister({
  create: update([Principal], MedicalProfile, (patientId) => {
    const id = generateId();
    const profile: MedicalProfileType = {
      id,
      patientId,
      diagnoses: [],
      prescriptions: [],
    };

    medicalProfiles.insert(id, profile);

    return profile;
  }),

  addDiagnosis: update(
    [Principal, text, Vec(DrugPrescription)],
    Result(Diagnosis, MedicalProfileErrors),
    (profileId, description, drugs) => {
      const profileOpts = medicalProfiles.get(profileId);

      if ("None" in profileOpts) {
        return Err({
          MedicalProfileDoesNotExist: profileId,
        });
      }

      const prescriptionId = generateId();

      const prescription: typeof Prescription = {
        id: prescriptionId,
        drugs,
        createdAt: ic.time(),
      };

      const id = generateId();
      const diagnosis: typeof Diagnosis = {
        id,
        description,
        prescriptions: prescription ? [prescription] : [],
        createdAt: ic.time(),
      };

      const profile = profileOpts.Some;
      profile.diagnoses.push(diagnosis);

      medicalProfiles.insert(profile.id, profile);

      return Ok(diagnosis);
    }
  ),

  delete: update([Principal], Void, (id) => {
    medicalProfiles.remove(id);
  }),

  get: query(
    [Principal],
    Result(MedicalProfile, MedicalProfileErrors),
    (profileId) => {
      const profileOpts = medicalProfiles.get(profileId);

      if ("None" in profileOpts) {
        return Err({
          MedicalProfileDoesNotExist: profileId,
        });
      }

      const profile = profileOpts.Some;

      return Ok(profile);
    }
  ),

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
