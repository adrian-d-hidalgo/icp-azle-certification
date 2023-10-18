import { Principal, ic, text } from "azle";
import PrescriptionCanister from "./prescriptions.canister";
import { PrescriptionDrugType } from "./models/prescription-drugs.models";

export class PrescriptionCaller {
  private canister: typeof PrescriptionCanister;

  constructor() {
    this.canister = PrescriptionCanister(
      // TODO: Fix this, I can't get values from .env files and dotenv has errors
      Principal.fromText("bd3sg-teaaa-aaaaa-qaaba-cai")
      //   Principal.fromText(
      //     process.env.PRESCRIPTIONS_PRINCIPAL ??
      //       ic.trap("process.env.PRESCRIPTIONS_PRINCIPAL is undefined")
      //   )
    );
  }

  public async create(
    patient: Principal,
    doctor: Principal,
    drugs: Array<PrescriptionDrugType>,
    notes: text
  ) {
    const medicalProfile = await ic.call(this.canister.create, {
      args: [patient, doctor, drugs, notes],
    });

    return medicalProfile;
  }
}
