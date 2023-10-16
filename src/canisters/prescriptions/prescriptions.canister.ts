import { Canister, Principal, Result, Vec, query, update } from "azle";
import { PrescriptionDrug, Prescription } from "./models/prescription.models";
import { PrescriptionErrors } from "./services/prescriptions.service.errors";
import { PrescriptionsService } from "./services/prescriptions.service";

// let prescriptions = StableBTreeMap(Principal, Prescription, 0);
const prescriptionsService = new PrescriptionsService();

export default Canister({
  create: update([Vec(PrescriptionDrug)], Prescription, (drugs) => {
    return prescriptionsService.create(drugs);
  }),

  get: query(
    [Principal],
    Result(Prescription, PrescriptionErrors),
    (prescriptionId) => {
      return prescriptionsService.get(prescriptionId);
    }
  ),
});
