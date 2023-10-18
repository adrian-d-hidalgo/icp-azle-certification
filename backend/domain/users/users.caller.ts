import { Principal, ic, text } from "azle";
import UsersCanister from "./users.canister";

export class UsersCaller {
  private canister: typeof UsersCanister;

  constructor() {
    this.canister = UsersCanister(
      // TODO: Fix this, I can't get values from .env files and dotenv has errors
      Principal.fromText("be2us-64aaa-aaaaa-qaabq-cai")
      //   Principal.fromText(
      //     process.env.USERS_PRINCIPAL ??
      //       ic.trap("process.env.USERS_PRINCIPAL is undefined")
      //   )
    );
  }

  public create(id: Principal, firstName: text, lastName: text, curp: text) {
    return ic.call(this.canister.create, {
      args: [id, firstName, lastName, curp],
    });
  }

  public get(userId: Principal) {
    return ic.call(this.canister.get, {
      args: [userId],
    });
  }

  public getMyPatientProfile(userId: Principal) {
    return ic.call(this.canister.getPatientProfile, {
      args: [userId],
    });
  }
}
