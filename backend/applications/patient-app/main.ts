import {
  Canister,
  Principal,
  Result,
  ic,
  init,
  query,
  text,
  update,
} from "azle";
import { UsersCaller } from "../../domain/users/caller";
import { User } from "../../domain/users/models/users.models";
import { UsersErrors } from "../../domain/users/errors";
import { PatientProfile } from "../../domain/patient-profiles/models/patient-profiles.models";
// import { AuthGuard } from "../../utilities/auth.guard";

const usersCaller = new UsersCaller();
let currentUserId: Principal;

export default Canister({
  init: init([], () => {
    // TODO: This is not running
    currentUserId = ic.caller();
  }),
  create: update(
    [text, text, text],
    Result(User, UsersErrors),
    async (firstName, lastName, curp) => {
      const userId = ic.caller();
      return await usersCaller.create(userId, firstName, lastName, curp);
    }
  ),
  getMyData: query([], Result(User, UsersErrors), async () => {
    ic.print({ currentUserId });
    const userId = ic.caller();
    return await usersCaller.get(userId);
  }),
  getMyPatientProfile: query(
    [],
    Result(PatientProfile, UsersErrors),
    async () => {
      const userId = ic.caller();
      return await usersCaller.getMyPatientProfile(userId);
    }
  ),
  getMyPrescriptions: query([], text, () => {
    return ic.caller().toUint8Array().toString(); // TODO: Add logic to retrieve prescriptions
  }),
});
