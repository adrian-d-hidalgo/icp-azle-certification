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
import { UsersCaller } from "../../domain/users/users.caller";
import { User } from "../../domain/users/models/users.models";
import { UsersErrors } from "../../domain/users/services/users.service.errors";
import { PatientProfile } from "../../domain/patient-profiles/models/patient-profiles.models";
import { AuthGuard } from "../../utilities/auth.guard";

const usersCaller = new UsersCaller();
let currentUserId: Principal;

export default Canister({
  init: init([], () => {
    // TODO: This is not running
    currentUserId = ic.caller();
  }),
  create: update(
    [text, text, text],
    User,
    async (firstName, lastName, curp) => {
      const userId = ic.caller();
      return await usersCaller.create(userId, firstName, lastName, curp);
    },
    {
      guard: AuthGuard,
    }
  ),
  getMyData: query(
    [],
    Result(User, UsersErrors),
    async () => {
      ic.print({ currentUserId });
      const userId = ic.caller();
      return await usersCaller.get(userId);
    },
    {
      guard: AuthGuard,
    }
  ),
  getMyPatientProfile: query(
    [],
    Result(PatientProfile, UsersErrors),
    async () => {
      const userId = ic.caller();
      return await usersCaller.getMyPatientProfile(userId);
    },
    {
      guard: AuthGuard,
    }
  ),
  getMyPrescriptions: query([], text, () => {
    return "Hello from getMyPatientProfile"; // TODO: Add logic to retrieve prescriptions
  }),
});
