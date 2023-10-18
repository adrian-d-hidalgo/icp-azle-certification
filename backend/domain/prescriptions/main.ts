import { Canister, Principal, Result, Vec, query, text, update } from "azle";
import { Prescription } from "./models/prescription.models";
import { PrescriptionDrug } from "./models/prescription-drugs.models";
import { PrescriptionErrors } from "./services/prescriptions.service.errors";
import { PrescriptionsService } from "./services/prescriptions.service";

// let prescriptions = StableBTreeMap(Principal, Prescription, 0);
const prescriptionsService = new PrescriptionsService();

export default Canister({
  create: update(
    [Principal, Principal, Vec(PrescriptionDrug), text],
    Prescription,
    (patient, doctor, drugs, notes = "") => {
      // TODO: The caller only can create prescriptions
      return prescriptionsService.create(patient, doctor, drugs, notes);
    }
  ),

  get: query(
    [Principal],
    Result(Prescription, PrescriptionErrors),
    (prescriptionId) => {
      return prescriptionsService.get(prescriptionId);
    }
  ),
});
