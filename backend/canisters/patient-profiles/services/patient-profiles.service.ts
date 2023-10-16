import { Err, Ok, Principal, StableBTreeMap, Vec, ic, text } from "azle";
import {
  Diagnosis,
  DiagnosisSymptomType,
  PatientProfile,
  PatientProfileType,
} from "../models/patient-profiles.models";
import { generateId } from "../../../utilities/helpers";

export class PatientProfilesService {
  private profiles = StableBTreeMap(Principal, PatientProfile, 0);

  public create() {
    const id = generateId();
    const profile: PatientProfileType = {
      id,
      cardex: [],
      medicalHistory: {
        diagnoses: [],
        prescriptions: [],
      },
      permissions: {
        doctors: [],
        organizations: [],
      },
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
    createdBy: Principal,
    description: text,
    symptoms: Vec<DiagnosisSymptomType>,
    treatmens: Vec<text>
  ) {
    const profileOpt = this.profiles.get(profileId);

    if ("None" in profileOpt) {
      return Err({
        PatientProfileDoesNotExist: profileId,
      });
    }

    const profile = profileOpt.Some;
    const id = generateId();

    const diagnosis: typeof Diagnosis = {
      id,
      description,
      symptoms,
      treatmens,
      prescriptions: [],
      notes: [],
      createdBy,
      createdAt: ic.time(),
    };

    profile.medicalHistory.diagnoses.push(diagnosis);

    this.profiles.insert(profile.id, profile);

    return Ok(diagnosis);
  }

  public getAllDiagnoses(profileId: Principal) {
    const profileOpt = this.profiles.get(profileId);

    if ("None" in profileOpt) {
      return Err({
        PatientProfileDoesNotExist: profileId,
      });
    }

    const diagnoses = profileOpt.Some.medicalHistory.diagnoses;

    return diagnoses;
  }
}
