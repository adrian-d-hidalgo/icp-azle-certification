import { Principal, ic } from "azle";
import PatientProfilesCanister from "./patient-profiles.canister";

export class PatientProfilesCaller {
  private canister: typeof PatientProfilesCanister;

  constructor() {
    this.canister = PatientProfilesCanister(
      // TODO: Fix this, I can't get values from .env files and dotenv has errors
      Principal.fromText("bkyz2-fmaaa-aaaaa-qaaaq-cai")
      //   Principal.fromText(
      //     process.env.PATIENT_PROFILES_PRINCIPAL ??
      //       ic.trap("process.env.PATIENT_PROFILES_PRINCIPAL is undefined")
      //   )
    );
  }

  public async create() {
    return ic.call(this.canister.create);
  }

  public async get(profileId: Principal) {
    return ic.call(this.canister.get, { args: [profileId] });
  }
}
