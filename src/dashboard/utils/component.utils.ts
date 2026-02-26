import { IOption } from "../../shared/types/general.types";
import { defaultComponentSettingForm } from "../components/ComponentSetting/ComponentSetting";
import { UNITS_PER_ROW } from "../components/CustomScreenGrid/CustomScreenGrid";
import { CardWidth } from "../pages/CustomScreen/CustomScreen";
import {
  ComponentType,
  IBaseComponent,
  TComponentFilters,
  TComponentHeader,
  TComponentLocation,
  TComponentSetting,
  TComponentToSAP,
} from "../types/component.types";
import {
  FilterOrgLevel,
  FilterType,
  IComponentFilter,
} from "../types/componentFilter.types";
import { OrgLevelCode } from "../types/dashboardOrgLevel.types";
import { IDashboardFiltersValue } from "../types/filters.types";
import { IScreen } from "../types/screen.types";

export const convertComponentRequest = (
  componentSetting: TComponentSetting,
  screenId: IScreen["id"]
): TComponentToSAP => {
  return {
    id: screenId,
    compHeader: [
      {
        id: componentSetting.id,
        screenId: screenId,
        name: componentSetting.name,
        type: componentSetting.type,
        toWarningThreshold: componentSetting.rangePercent.toWarningThreshold,
        toSevereThreshold: componentSetting.rangePercent.toSevereThreshold,
        filters: [
          ...componentSetting.filters
            .map<IComponentFilter[]>((filter) =>
              filter.values.map((value) => ({
                id: "",
                componentId: componentSetting.id,
                field: filter.fieldKey as FilterType,
                value: value.value,
              }))
            )
            .flat(),
          ...Object.keys(componentSetting.orgLevel)
            .filter((key) => componentSetting.orgLevel[key])
            .map((key) =>
              componentSetting.orgLevel[key].map(
                (value) =>
                  ({
                    id: "",
                    componentId: componentSetting.id,
                    field: FilterOrgLevel[key],
                    value: String(value.value),
                  }) as IComponentFilter
              )
            )
            .flat(),
        ],
      },
    ],
    compMeta: [
      {
        id: componentSetting.id,
        compColumn: componentSetting.compColumn,
        compRow: componentSetting.compRow,
      },
    ],
  } as TComponentToSAP;
};

export const getNewComponentLocation = (
  componnets: IBaseComponent[],
  newComponentType: ComponentType
): Pick<TComponentLocation, "compColumn" | "compRow"> => {
  const sortedComponentsByLocation = componnets
    ? [...componnets].sort((a, b) => {
        if (a.compRow === b.compRow) {
          return b.compColumn - a.compColumn;
        } else {
          return a.compRow - b.compRow;
        }
      })
    : [];

  if (!sortedComponentsByLocation.length) {
    return {
      compRow: 0,
      compColumn: UNITS_PER_ROW - CardWidth[newComponentType],
    };
  }

  const maxLocated =
    sortedComponentsByLocation[sortedComponentsByLocation.length - 1];

  if (maxLocated.compColumn - CardWidth[newComponentType] < 0) {
    return {
      compRow: maxLocated.compRow + 1,
      compColumn: UNITS_PER_ROW - CardWidth[newComponentType],
    };
  }

  return {
    compRow: maxLocated.compRow,
    compColumn: maxLocated.compColumn - CardWidth[newComponentType],
  };
};

// Adapts the server response to match the component's data base on its ComponentSetting fields.
export const adaptResponseToComponentSetting = (
  componentResponse: TComponentHeader | undefined
): TComponentSetting => {
  let componentSetting: TComponentSetting = JSON.parse(
    JSON.stringify(defaultComponentSettingForm)
  );

  if (!componentResponse?.id) return componentSetting;

  componentResponse?.filters?.forEach((filter: IComponentFilter) => {
    switch (filter.field) {
      case FilterOrgLevel[OrgLevelCode.TREE_TYPE]:
        componentSetting.orgLevel[OrgLevelCode.TREE_TYPE] = [
          {
            label: "",
            value: filter.value,
          } as IOption,
        ];
        break;
      case FilterOrgLevel[OrgLevelCode.PIKUD]:
        componentSetting.orgLevel[OrgLevelCode.PIKUD].push({
          label: "",
          value: filter.value,
        } as IOption);
        break;
      case FilterOrgLevel[OrgLevelCode.UGDA]:
        componentSetting.orgLevel[OrgLevelCode.UGDA].push({
          label: "",
          value: filter.value,
        } as IOption);
        break;
      case FilterOrgLevel[OrgLevelCode.UTZVA]:
        componentSetting.orgLevel[OrgLevelCode.UTZVA].push({
          label: "",
          value: filter.value,
        } as IOption);
        break;
      case FilterOrgLevel[OrgLevelCode.GDUD]:
        componentSetting.orgLevel[OrgLevelCode.GDUD].push({
          label: "",
          value: filter.value,
        } as IOption);
        break;
      default:
        const filterIndex = componentSetting.filters.findIndex(
          (f: IDashboardFiltersValue<TComponentFilters>) =>
            f.fieldKey === filter.field
        );

        if (filterIndex >= 0) {
          componentSetting.filters = componentSetting.filters.map(
            (f: IDashboardFiltersValue<TComponentFilters>) =>
              f.fieldKey === filter.field
                ? {
                    ...f,
                    values: [...f.values, { text: "", value: filter.value }],
                  }
                : f
          );
        } else {
          componentSetting.filters = [
            ...componentSetting.filters,
            {
              fieldKey: filter.field,
              fieldTitle: "",
              values: [{ text: "", value: filter.value }],
            },
          ];
        }
        break;
    }
  });

  componentSetting.id = componentResponse.id;
  componentSetting.name = componentResponse.name;
  componentSetting.type = componentResponse.type;
  componentSetting.rangePercent = {
    toSevereThreshold: componentResponse.toSevereThreshold,
    toWarningThreshold: componentResponse.toWarningThreshold,
  };
  componentSetting.compColumn = componentResponse.compColumn;
  componentSetting.compRow = componentResponse.compRow;

  return componentSetting;
};
