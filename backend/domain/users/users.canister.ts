import {
  Canister,
  Err,
  Ok,
  Principal,
  query,
  Result,
  text,
  update,
  Vec,
} from "azle";
import { User } from "./models/users.models";
import { UsersErrors } from "./users.canister.errors";
import { UsersService } from "./services/users.service";
import { PatientProfile } from "../patient-profiles/models/patient-profiles.models";

const usersService = new UsersService();

export default Canister({
  create: update(
    [Principal, text, text, text],
    Result(User, UsersErrors),
    async (id, firstName, lastName, curp) => {
      const data = {
        profile: {
          firstName,
          lastName,
          curp,
        },
      };

      try {
        const user = await usersService.create(id, data);
        return Ok(user);
      } catch (error: any) {
        return Err({
          UserCouldNotBeCreated: error.message,
        });
      }
    }
  ),

  getAll: query([], Vec(User), () => {
    return usersService.getAll();
  }),

  get: query([Principal], Result(User, UsersErrors), (id) => {
    try {
      const user = usersService.get(id);
      return Ok(user);
    } catch (error) {
      return Err({
        UserDoesNotExist: id,
      });
    }
  }),

  getPatientProfile: query(
    [Principal],
    Result(PatientProfile, UsersErrors),
    async (userId) => {
      try {
        const profile = await usersService.getPatientProfile(userId);
        return Ok(profile);
      } catch (error: any) {
        return Err({
          UnexpectedError: error.message,
        });
      }
    }
  ),
});
