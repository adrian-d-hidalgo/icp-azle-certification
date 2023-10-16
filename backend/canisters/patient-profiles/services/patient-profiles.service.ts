import { Err, Ok, Principal, StableBTreeMap, Vec, ic, text } from "azle";
import {
  Diagnosis,
  PatientProfile,
  PatientProfileType,
} from "../models/patient-profiles.models";
import { generateId } from "../../../utilities/helpers";
import { PrescriptionCaller } from "../../prescriptions/prescriptions.caller";
import { PrescriptionDrug } from "../../prescriptions/models/prescription.models";

export class PatientProfilesService {
  private profiles = StableBTreeMap(Principal, PatientProfile, 0);
  private prescriptionCanister = new PrescriptionCaller();

  public create() {
    const id = generateId();
    const profile: PatientProfileType = {
      id,
      diagnoses: [],
      prescriptions: [],
    };

    this.profiles.insert(id, profile);

    return profile;
  }

  public get(profileId: Principal) {
    const profileOpt = this.profiles.get(profileId);

    if ("None" in profileOpt) {
      return Err({
        PatientProfileDoesNotExist: profileId,
      });
    }

    const profile = profileOpt.Some;

    return Ok(profile);
  }

  public getAll() {
    const profiles = this.profiles.values();
    return profiles;
  }

  public async addDiagnosis(
    profileId: Principal,
    description: text,
    drugs: Vec<typeof PrescriptionDrug>
  ) {
    const profileOpt = this.profiles.get(profileId);

    if ("None" in profileOpt) {
      return Err({
        PatientProfileDoesNotExist: profileId,
      });
    }

    const prescription = await this.prescriptionCanister.create(drugs);

    const id = generateId();

    const diagnosis: typeof Diagnosis = {
      id,
      description,
      prescriptions: prescription ? [prescription.id] : [],
      createdAt: ic.time(),
    };

    const profile = profileOpt.Some;
    profile.diagnoses.push(diagnosis);

    this.profiles.insert(profile.id, profile);

    return Ok(diagnosis);
  }
}
