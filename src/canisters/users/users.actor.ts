import {
  Canister,
  Err,
  ic,
  init,
  Ok,
  Principal,
  query,
  Result,
  StableBTreeMap,
  text,
  update,
} from "azle";
import { generateId } from "../../utilities/helpers";
import { User } from "./users.models";
import { UserType } from "./users.types";
import { UsersErrors } from "./users.errors";
import { GetAllUsersResponse } from "./users.responses";
import { PatientProfilesCaller } from "../patient-profiles/patient-profiles.caller";
import { PatientProfile } from "../patient-profiles/patient-profiles.models";
import { PatientProfilesErrors } from "../patient-profiles/patient-profiles.errors";

let users = StableBTreeMap(Principal, User, 0);
// let profileCanister: PatientProfilesCaller;

export default Canister({
  // This isn't working
  init: init([], () => {
    // profileCanister = new PatientProfilesCaller();
  }),
  create: update(
    [text, text, text],
    User,
    async (firstName, lastName, curp) => {
      const id = generateId();
      // Remove next line when init already works
      const profileCanister = new PatientProfilesCaller();
      const patientProfile = await profileCanister.create(id);

      const patient: UserType = {
        id,
        profile: {
          firstName,
          lastName,
          curp,
        },
        patientProfile: patientProfile.id,
        createdAt: ic.time(),
      };

      users.insert(id, patient);

      return patient;
    }
  ),

  getAll: query([], GetAllUsersResponse, () => {
    const result = users.values().map((user) => ({
      id: user.id,
      profile: user.profile,
    }));

    return result;
  }),

  get: query([Principal], Result(User, UsersErrors), (id) => {
    const userOpt = users.get(id);
    if ("None" in userOpt) {
      return Err({
        UserDoesNotExist: id,
      });
    }

    const user = userOpt.Some;

    return Ok(user);
  }),
  // TODO: This action is not possible, due isn't allowed inter-canister query calls
  getMedicalHistory: query(
    [Principal],
    Result(PatientProfile, PatientProfilesErrors),
    (userId) => {
      const profileCaller = new PatientProfilesCaller();
      return profileCaller.getByUser(userId);
    }
  ),
});
