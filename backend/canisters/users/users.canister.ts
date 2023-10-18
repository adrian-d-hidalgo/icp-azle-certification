import { Canister, Principal, query, Result, text, update, Vec } from "azle";
import { User } from "./models/users.models";
import { UsersErrors } from "./services/users.service.errors";
import { UsersService } from "./services/users.service";
import { PatientProfile } from "../patient-profiles/models/patient-profiles.models";

const usersService = new UsersService();

export default Canister({
  create: update(
    [text, text, text],
    User,
    async (firstName, lastName, curp) => {
      // TODO: The caller only can create its own user
      const data = {
        profile: {
          firstName,
          lastName,
          curp,
        },
      };

      return usersService.create(data);
    }
  ),

  getAll: query([], Vec(User), () => {
    const users = usersService.getAll();
    return users;
  }),

  get: query([Principal], Result(User, UsersErrors), (id) => {
    return usersService.get(id);
  }),

  getPatientProfile: query(
    [Principal],
    Result(PatientProfile, UsersErrors) as any, //TODO: Fix this type
    async (userId) => {
      return await usersService.getPatientProfile(userId);
    }
  ),
});
