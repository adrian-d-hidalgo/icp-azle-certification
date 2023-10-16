import { Err, Ok, Principal, StableBTreeMap, Vec, ic } from "azle";
import {
  PrescriptionDrugType,
  PrescriptionType,
} from "../models/prescription.models";
import { Prescription } from "../models/prescription.models";
import { generateId } from "../../../utilities/helpers";

export class PrescriptionsService {
  private prescriptions = StableBTreeMap(Principal, Prescription, 0);

  public create(drugs: Vec<PrescriptionDrugType>) {
    const id = generateId();
    const prescription: PrescriptionType = {
      id,
      drugs,
      createdAt: ic.time(),
    };

    this.prescriptions.insert(id, prescription);

    return prescription;
  }

  public get(prescriptionId: Principal) {
    const prescriptionOtps = this.prescriptions.get(prescriptionId);

    if ("None" in prescriptionOtps) {
      return Err({
        PrescriptionDoesNotExist: prescriptionId,
      });
    }

    const prescription = prescriptionOtps.Some;

    return Ok(prescription);
  }
}
