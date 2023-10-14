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
  MedicalProfile,
  MedicalProfileType,
} from "./medical-profiles.models";
import { generateId } from "../../utilities/helpers";
import { MedicalProfileErrors } from "./medical-profiles.errors";
import { PrescriptionDrug } from "../prescriptions/prescription.models";
import { PrescriptionCaller } from "../prescriptions/prescription.caller";

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
    [Principal, text, Vec(PrescriptionDrug)],
    Result(Diagnosis, MedicalProfileErrors),
    async (profileId, description, drugs) => {
      const profileOpts = medicalProfiles.get(profileId);

      if ("None" in profileOpts) {
        return Err({
          MedicalProfileDoesNotExist: profileId,
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
