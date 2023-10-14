import {
  Canister,
  Err,
  ic,
  init,
  Ok,
  Principal,
  query,
  Result,
  StableBTreeMap,
  text,
  update,
} from "azle";
import { generateId } from "../../utilities/helpers";
import { Patient } from "./patients.models";
import { PatientType } from "./patients.types";
import { PatientsErrors } from "./patients.errors";
import { GetAllPatientsResponse } from "./patients.responses";
import { MedicalProfileConnect } from "../medical-profiles/medical-profiles.connector";
import { MedicalProfile } from "../medical-profiles/medical-profiles.models";
import { MedicalProfileErrors } from "../medical-profiles/medical-profiles.errors";

let patients = StableBTreeMap(Principal, Patient, 0);
// let profileCanister: MedicalProfileConnect;

export default Canister({
  init: init([], () => {
    // profileCanister = new MedicalProfileConnect();
  }),
  create: update(
    [text, text, text],
    Patient,
    async (firstName, lastName, curp) => {
      const id = generateId();
      const profileCanister = new MedicalProfileConnect();
      const medicalProfile = await profileCanister.create(id);

      const patient: PatientType = {
        id,
        firstName,
        lastName,
        curp,
        medicalProfile: medicalProfile.id,
        createdAt: ic.time(),
      };

      patients.insert(id, patient);

      return patient;
    }
  ),

  getAll: query([], GetAllPatientsResponse, () => {
    const result = patients.values().map((patient) => ({
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
    }));

    return result;
  }),

  get: query([Principal], Result(Patient, PatientsErrors), (id) => {
    const patientOpt = patients.get(id);
    if ("None" in patientOpt) {
      return Err({
        PatientDoesNotExist: id,
      });
    }

    const patient = patientOpt.Some;

    return Ok(patient);
  }),
  // TODO: Fix this, I think this doesn`t work due you can't do nested queries
  getMedicalProfile: query(
    [Principal],
    Result(MedicalProfile, MedicalProfileErrors),
    (patientId) => {
      const profileCanister = new MedicalProfileConnect();
      return profileCanister.getByPatient(patientId);
    }
  ),
});
