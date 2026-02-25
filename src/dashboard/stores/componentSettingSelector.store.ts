import { selectorFamily } from "recoil";
import { MAIN_COMPONENT_INDEX } from "../pages/DrillDownScreen/DrillDownScreen";
import { TComponentHeader } from "../types/component.types";
import { drillStackAtom } from "./drillStack.store";

export const componentSettingSelector = selectorFamily({
  key: "componentSettingSelector",
  get:
    (componentId: string) =>
    ({ get }) => {
      const drillStack = get(drillStackAtom);
      if (drillStack.length === 0) {
        return null;
      }
      const currentItem = drillStack[drillStack.length - 1];
      const mainComponent = currentItem?.mainComponent.data;
      return {
        id: mainComponent?.id,
        name:
          Number(componentId) === MAIN_COMPONENT_INDEX
            ? currentItem?.mainComponent.data.name
            : currentItem?.components[componentId]?.name,
        type: mainComponent?.type,
        toSevereThreshold: mainComponent?.toSevereThreshold,
        toWarningThreshold: mainComponent?.toWarningThreshold,
        filters:
          Number(componentId) === MAIN_COMPONENT_INDEX
            ? currentItem?.mainComponent.filters
            : currentItem?.components[componentId]?.filters,
      } as TComponentHeader;
    },
});
