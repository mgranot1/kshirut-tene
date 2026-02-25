import { Drilltype } from "../pages/CustomScreen/CustomScreen";
import { KshirutType } from "../stores/kshirutType.store";
import { ComponentType, GraphDataMap, TComponentData } from "./component.types";
import { IComponentFilter } from "./componentFilter.types";

export type TComponentSplitBody = {
  drillBy: Drilltype;
  filters: IComponentFilter[];
  kshirutType: KshirutType;
  componentType: ComponentType;
};

export type TComponentSplitRes<T extends ComponentType> = {
  mainCompData: GraphDataMap[T];
  offspringFiltersAndData: TDrillComponent<ComponentType>[];
};

export type TDrillComponent<T extends ComponentType> = {
  name: string;
  filters: IComponentFilter[];
  data: GraphDataMap[T];
};

export type TDrillStack = {
  mainComponent: {
    data: TComponentData<ComponentType>;
    filters: IComponentFilter[];
  };
  components: TDrillComponent<ComponentType>[];
  drillBy: Drilltype;
};
