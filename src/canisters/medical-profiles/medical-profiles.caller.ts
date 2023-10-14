import { Principal, ic } from "azle";
import MedicalProfileCanister from "./medical-profiles.actor";

export class MedicalProfileCaller {
  private canister: typeof MedicalProfileCanister;

  constructor() {
    this.canister = MedicalProfileCanister(
      // TODO: Fix this, I can't get values from .env files and dotenv has errors
      Principal.fromText("bkyz2-fmaaa-aaaaa-qaaaq-cai")
      //   Principal.fromText(
      //     process.env.MEDICAL_PROFILE_PRINCIPAL ??
      //       ic.trap("process.env.MEDICAL_PROFILE_PRINCIPAL is undefined")
      //   )
    );
  }

  public async create(patientId: Principal) {
    const medicalProfile = await ic.call(this.canister.create, {
      args: [patientId],
    });

    return medicalProfile;
  }

  public async getByPatient(patientId: Principal) {
    const medicalProfile = await ic.call(this.canister.getByPatient, {
      args: [patientId],
    });

    return medicalProfile;
  }
}
