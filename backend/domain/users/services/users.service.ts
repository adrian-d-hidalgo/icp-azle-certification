import { None, Principal, StableBTreeMap, ic } from "azle";
import { User, UserType } from "../models/users.models";
import { PatientProfilesCaller } from "../../patient-profiles/patient-profiles.caller";
import { CreateUserData } from "./user.service.types";
import {
  UserAlreadyExistsError,
  UserCouldNotBeCreatedError,
  UserDoesNotExistError,
  UserPatientProfileDoesNotExist,
} from "./user.service.errors";

export class UsersService {
  private users = StableBTreeMap(Principal, User, 0);
  private profileCanister = new PatientProfilesCaller();

  public async create(id: Principal, data: CreateUserData) {
    const userFound = this.users
      .values()
      .find(
        (usr) =>
          usr.id.toText() === id.toText() ||
          usr.profile.curp === data.profile.curp
      );

    if (userFound) {
      throw new UserAlreadyExistsError("This user already exists");
    }

    try {
      const patientProfile = await this.profileCanister.create(); // TODO: Remove this profile if create user fails

      const user: UserType = {
        id,
        profile: data.profile,
        patientProfile: patientProfile.id,
        doctorProfile: None,
        createdAt: ic.time(),
      };

      this.users.insert(id, user);

      return user;
    } catch (error: any) {
      throw new UserCouldNotBeCreatedError(error.message);
    }
  }

  public getAll() {
    return this.users.values();
  }

  public get(principal: Principal) {
    const userOpt = this.users.get(principal);
    if ("None" in userOpt) {
      throw new UserDoesNotExistError(principal.toText());
    }

    return userOpt.Some;
  }

  public async getPatientProfile(userId: Principal) {
    try {
      const user = this.get(userId);
      const profile = await this.profileCanister.get(user.patientProfile);

      if ("Err" in profile) {
        throw new UserPatientProfileDoesNotExist(user.patientProfile.toText());
      }

      return profile.Ok;
    } catch (error) {
      throw error;
    }
  }
}
