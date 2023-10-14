import { Principal, ic } from "azle";
import PrescriptionCanister from "./prescriptions.actor";
import { PrescriptionDrug } from "./prescription.models";

export class PrescriptionCaller {
  private canister: typeof PrescriptionCanister;

  constructor() {
    this.canister = PrescriptionCanister(
      // TODO: Fix this, I can't get values from .env files and dotenv has errors
      Principal.fromText("be2us-64aaa-aaaaa-qaabq-cai")
      //   Principal.fromText(
      //     process.env.PRESCRIPTION_PRINCIPAL ??
      //       ic.trap("process.env.PRESCRIPTION_PRINCIPAL is undefined")
      //   )
    );
  }

  public async create(drugs: Array<typeof PrescriptionDrug>) {
    const medicalProfile = await ic.call(this.canister.create, {
      args: [drugs],
    });

    return medicalProfile;
  }
}
