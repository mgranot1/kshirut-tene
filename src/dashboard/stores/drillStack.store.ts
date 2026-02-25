import { atom } from "recoil";
import { TDrillStack } from "../types/drilldown.types";

// The drillStack atom represents the entire tree that is created in the process of "drillingDown" from a component. Family or tsav irgun, either are.
//  It contains all the information about each component that appears in the components' DrillDownScreen.
export const drillStackAtom = atom<TDrillStack[]>({
  key: "drillStackAtom",
  default: [],
});
