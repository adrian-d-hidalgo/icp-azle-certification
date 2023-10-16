import { Canister, Principal, query, Result, text, update } from "azle";
import { User } from "./models/users.models";
import { UsersErrors } from "./services/users.service.errors";
import { GetAllUsersResponse } from "./users.responses";
import { UsersService } from "./services/users.service";

let usersService = new UsersService();

export default Canister({
  create: update(
    [text, text, text],
    User,
    async (firstName, lastName, curp) => {
      const data = {
        profile: {
          firstName,
          lastName,
          curp,
        },
      };
      const user = await usersService.create(data);

      return user;
    }
  ),

  getAll: query([], GetAllUsersResponse, () => {
    const users = usersService.getAll();
    return users;
  }),

  get: query([Principal], Result(User, UsersErrors), (id) => {
    const user = usersService.get(id);
    return user;
  }),
});
