import { Err, Ok, Principal, StableBTreeMap, Vec, ic, text } from "azle";
import { PrescriptionDrugType } from "../models/prescription-drugs.models";
import { Prescription, PrescriptionType } from "../models/prescription.models";
import { generateId } from "../../../utilities/helpers";

export class PrescriptionsService {
  private prescriptions = StableBTreeMap(Principal, Prescription, 0);

  public create(
    patient: Principal,
    doctor: Principal,
    drugs: Vec<PrescriptionDrugType>,
    notes: text = ""
  ) {
    // Do we have to necessarilt realte a prescription?
    const id = generateId();
    const prescription: PrescriptionType = {
      id,
      patient,
      doctor,
      drugs,
      notes: notes,
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
