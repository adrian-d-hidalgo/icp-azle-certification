import { Principal, ic } from "azle";
import PatientProfilesCanister from "./main";

export class PatientProfilesCaller {
  private canister: typeof PatientProfilesCanister;

  constructor() {
    this.canister = PatientProfilesCanister(
      // TODO: Fix this, I can't get values from .env files and dotenv has errors
      Principal.fromText("bd3sg-teaaa-aaaaa-qaaba-cai")
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
