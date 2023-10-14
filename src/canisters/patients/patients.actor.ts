import {
  Canister,
  Err,
  ic,
  Ok,
  Principal,
  query,
  Result,
  StableBTreeMap,
  text,
  update,
  Vec,
} from "azle";
import { generateId } from "../../utilities/helpers";
import { Patient } from "./patients.models";
import { PatientType } from "./patients.types";
import { PatientsError } from "./patients.errors";
import { GetAllPatientsResponse } from "./patients.responses";

let patients = StableBTreeMap(Principal, Patient, 0);

export default Canister({
  create: update([text, text, text], Patient, (firstName, lastName, curp) => {
    const id = generateId();

    const patient: PatientType = {
      id,
      firstName,
      lastName,
      curp,
      medicalHistory: {
        diagnoses: [],
        prescriptions: [],
      },
      createdAt: ic.time(),
    };

    patients.insert(id, patient);

    return patient;
  }),

  getAll: query([], GetAllPatientsResponse, () => {
    const result = patients.values().map((patient) => ({
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
    }));

    return result;
  }),

  getByPrincipal: query([Principal], Result(Patient, PatientsError), (id) => {
    const patientOpt = patients.get(id);
    if ("None" in patientOpt) {
      return Err({
        PatientDoesNotExist: id,
      });
    }

    const patient = patientOpt.Some;

    return Ok(patient);
  }),
});
