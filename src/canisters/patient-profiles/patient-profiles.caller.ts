import { Principal, ic } from "azle";
import PatientProfilesCanister from "./patient-profiles.actor";

export class PatientProfilesCaller {
  private canister: typeof PatientProfilesCanister;

  constructor() {
    this.canister = PatientProfilesCanister(
      // TODO: Fix this, I can't get values from .env files and dotenv has errors
      Principal.fromText("br5f7-7uaaa-aaaaa-qaaca-cai")
      //   Principal.fromText(
      //     process.env.PATIENT_PROFILES_PRINCIPAL ??
      //       ic.trap("process.env.PATIENT_PROFILES_PRINCIPAL is undefined")
      //   )
    );
  }

  public async create(patientId: Principal) {
    const profile = await ic.call(this.canister.create, {
      args: [patientId],
    });

    return profile;
  }

  public async getByUser(userId: Principal) {
    const profile = await ic.call(this.canister.getByUser, {
      args: [userId],
    });

    return profile;
  }
}
