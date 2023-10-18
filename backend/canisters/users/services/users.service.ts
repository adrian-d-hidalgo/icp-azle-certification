import { Err, None, Ok, Principal, StableBTreeMap, ic } from "azle";
import { User, UserType } from "../models/users.models";
import { PatientProfilesCaller } from "../../patient-profiles/patient-profiles.caller";
import { generateId } from "../../../utilities/helpers";
import { CreateUserData } from "./user.service.types";

export class UsersService {
  private users = StableBTreeMap(Principal, User, 0);
  private profileCanister = new PatientProfilesCaller();

  public async create(data: CreateUserData) {
    const id = generateId();
    // Remove next line when init already works
    const patientProfile = await this.profileCanister.create();

    const patient: UserType = {
      id,
      profile: data.profile,
      patientProfile: patientProfile.id,
      doctorProfile: None,
      createdAt: ic.time(),
    };

    this.users.insert(id, patient);

    return patient;
  }

  public getAll() {
    return this.users.values();
  }

  public get(principal: Principal) {
    const userOpt = this.users.get(principal);
    if ("None" in userOpt) {
      return Err({
        UserDoesNotExist: principal,
      });
    }

    const user = userOpt.Some;

    return Ok(user);
  }

  public async getPatientProfile(userId: Principal) {
    const userOpt = this.users.get(userId);

    if ("None" in userOpt) {
      return Err({
        UserDoesNotExist: userId,
      });
    }

    const user = userOpt.Some;

    return this.profileCanister.get(user.patientProfile);
  }
}
