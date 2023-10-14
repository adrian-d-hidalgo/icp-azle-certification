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
  update,
} from "azle";
import { PrescriptionDrug, Prescription } from "./prescription.models";
import { generateId } from "../../utilities/helpers";
import { PrescriptionErrors } from "./prescription.errors";

let prescriptions = StableBTreeMap(Principal, Prescription, 0);

export default Canister({
  create: update([Vec(PrescriptionDrug)], Prescription, (drugs) => {
    const id = generateId();
    const prescription: typeof Prescription = {
      id,
      drugs,
      createdAt: ic.time(),
    };

    prescriptions.insert(id, prescription);

    return prescription;
  }),

  get: query(
    [Principal],
    Result(Prescription, PrescriptionErrors),
    (prescriptionId) => {
      const prescriptionOtps = prescriptions.get(prescriptionId);

      if ("None" in prescriptionOtps) {
        return Err({
          PrescriptionDoesNotExist: prescriptionId,
        });
      }

      const prescription = prescriptionOtps.Some;

      return Ok(prescription);
    }
  ),
});
