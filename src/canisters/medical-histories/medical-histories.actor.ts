import { Canister, Principal, StableBTreeMap, Vec, query, update } from "azle";
import { MedicalHistory, MedicalHistoryType } from "./medical-histories.models";
import { generateId } from "../../utilities/helpers";

let medicalHistories = StableBTreeMap(Principal, MedicalHistory, 0);

export default Canister({
  create: update([Principal], MedicalHistory, (patientId) => {
    const id = generateId();
    const medicalHistory: MedicalHistoryType = {
      id,
      patientId,
      diagnoses: [],
      prescriptions: [],
    };

    medicalHistories.insert(id, medicalHistory);

    return medicalHistory;
  }),

  getAll: query([], Vec(MedicalHistory), () => {
    return medicalHistories.values();
  }),
});
