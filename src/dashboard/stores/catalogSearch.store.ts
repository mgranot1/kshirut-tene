import { atom } from "recoil";
import { SearchFields } from "../types/advancedSearch.type";

export const INITIAL_SEARCH_FEILDS: SearchFields = {
  screenName: "",
  screenId: "",
  categoryIds: [],
  creators: [],
};

export const catalogSearchAtom = atom<SearchFields>({
  key: "catalogSearchAtom",
  default: INITIAL_SEARCH_FEILDS,
});
