import { Canister, Principal, query, Result, text, update, Vec } from "azle";
import { User } from "./models/users.models";
import { UsersErrors } from "./services/users.service.errors";
import { UsersService } from "./services/users.service";

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

      const user = await usersService.create(data);

      return user;
    }
  ),

  getAll: query([], Vec(User), () => {
    const users = usersService.getAll();
    return users;
  }),

  get: query([Principal], Result(User, UsersErrors), (id) => {
    const user = usersService.get(id);
    return user;
  }),
});
