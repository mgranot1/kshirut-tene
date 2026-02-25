import { atom, selector } from "recoil";
import FamilyService from "../../shared/services/family/family.service";
import { IFamily } from "../types/family.types";

export const familiesListAtom = atom<IFamily[]>({
  key: "familiesAtom",
  default: [],
});
//todo: delete it and use react query each page (dashboard)

export const familiesListState = selector<IFamily[]>({
  key: "familiesState",
  async get({ get, getCallback }) {
    const familiesAtomValue = get(familiesListAtom);

    if (familiesAtomValue.length <= 0) {
      const families = await FamilyService.getFamilies();

      getCallback(({ set }) => {
        return () => {
          set(familiesListAtom, families);
        };
      });

      return families;
    }

    return familiesAtomValue;
  },
});
